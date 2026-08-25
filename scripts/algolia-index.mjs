/**
 * Crawl the published Docusaurus site and upload DocSearch v3 records.
 *
 * Required: ALGOLIA_ADMIN_API_KEY (or a Write key with settings + addObject + deleteIndex)
 * Optional: ALGOLIA_APP_ID / ALGOLIA_INDEX_NAME / ALGOLIA_SITE_URL / ALGOLIA_RECORD_ORIGIN
 *
 * Usage:
 *   npm run algolia:index
 *   node scripts/algolia-index.mjs --dry-run
 */
import { createHash } from "node:crypto";
import "dotenv/config";
import * as cheerio from "cheerio";

const APP_ID = (process.env.ALGOLIA_APP_ID || "1VU781LYTV").trim();
const INDEX_NAME = (process.env.ALGOLIA_INDEX_NAME || "x5_cases_doc").trim();
const SITE_URL = normalizeSiteUrl(
  process.env.ALGOLIA_SITE_URL || "https://developer.d-robotics.cc/x5_cases_doc/",
);
const RECORD_ORIGIN = (process.env.ALGOLIA_RECORD_ORIGIN || "").trim();
const API_KEY = (process.env.ALGOLIA_ADMIN_API_KEY || "").trim();
const DRY_RUN = process.argv.includes("--dry-run");

const HOST = `https://${APP_ID}.algolia.net`;
const USER_AGENT = "x5-cases-doc-algolia-indexer/1.0";
const BATCH_SIZE = 1000;
const FETCH_CONCURRENCY = 6;

const LEVEL_WEIGHT = {
  lvl0: 100,
  lvl1: 90,
  lvl2: 80,
  lvl3: 70,
  lvl4: 60,
  lvl5: 50,
  lvl6: 40,
  content: 0,
};

/** DocSearch / Docusaurus v3 compatible index settings */
const INDEX_SETTINGS = {
  minWordSizefor1Typo: 3,
  minWordSizefor2Typos: 7,
  allowTyposOnNumericTokens: false,
  minProximity: 1,
  searchableAttributes: [
    "unordered(hierarchy.lvl0)",
    "unordered(hierarchy.lvl1)",
    "unordered(hierarchy.lvl2)",
    "unordered(hierarchy.lvl3)",
    "unordered(hierarchy.lvl4)",
    "unordered(hierarchy.lvl5)",
    "unordered(hierarchy.lvl6)",
    "content",
  ],
  distinct: true,
  attributeForDistinct: "url",
  customRanking: [
    "desc(weight.pageRank)",
    "desc(weight.level)",
    "asc(weight.position)",
  ],
  ranking: [
    "words",
    "filters",
    "typo",
    "attribute",
    "proximity",
    "exact",
    "custom",
  ],
  highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
  highlightPostTag: "</span>",
  attributesToHighlight: [
    "hierarchy.lvl0",
    "hierarchy.lvl1",
    "hierarchy.lvl2",
    "hierarchy.lvl3",
    "hierarchy.lvl4",
    "hierarchy.lvl5",
    "hierarchy.lvl6",
    "content",
  ],
  attributesToSnippet: ["content:10"],
  attributesToRetrieve: [
    "hierarchy",
    "content",
    "anchor",
    "url",
    "url_without_anchor",
    "type",
  ],
  camelCaseAttributes: ["hierarchy", "hierarchy_radio", "content"],
  attributesForFaceting: [
    "type",
    "lang",
    "language",
    "version",
    "docusaurus_tag",
  ],
  advancedSyntax: true,
  ignorePlurals: true,
  removeWordsIfNoResults: "allOptional",
};

function normalizeSiteUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    throw new Error("ALGOLIA_SITE_URL is empty");
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function algoliaHeaders() {
  return {
    "X-Algolia-Application-Id": APP_ID,
    "X-Algolia-API-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

async function algoliaJson(method, pathname, body) {
  const response = await fetch(`${HOST}${pathname}`, {
    method,
    headers: algoliaHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!response.ok) {
    const detail = data.message || data.status || text || response.statusText;
    throw new Error(
      `Algolia ${method} ${pathname} failed (${response.status}): ${detail}`,
    );
  }
  return data;
}

async function waitTask(taskID) {
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    const task = await algoliaJson(
      "GET",
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/task/${taskID}`,
    );
    if (task.status === "published") {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Timed out waiting for Algolia task ${taskID}`);
}

function rewriteToSite(url) {
  const loc = new URL(url);
  const site = new URL(SITE_URL);
  if (loc.origin === site.origin) {
    return loc.href;
  }
  return new URL(`${loc.pathname}${loc.search}${loc.hash}`, site.origin).href;
}

function toRecordUrl(url) {
  if (!RECORD_ORIGIN) {
    return url;
  }
  const current = new URL(url);
  const origin = new URL(RECORD_ORIGIN.endsWith("/") ? RECORD_ORIGIN : `${RECORD_ORIGIN}/`);
  return new URL(
    `${current.pathname}${current.search}${current.hash}`,
    origin.origin,
  ).href;
}

function stripHash(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  return parsed.href;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingText($, el) {
  const clone = $(el).clone();
  clone.find(".hash-link, .anchor, .header-anchor").remove();
  return cleanText(clone.text());
}

function contentText($, el) {
  const clone = $(el).clone();
  clone.find("ul, ol, pre, table, .hash-link, .anchor, button, script, style").remove();
  return cleanText(clone.text());
}

function headingAnchor($, el) {
  const id = $(el).attr("id");
  if (id) {
    return id;
  }
  const href = $(el).find("a.hash-link, a.anchor, a.header-anchor").attr("href") || "";
  if (href.startsWith("#")) {
    return decodeURIComponent(href.slice(1));
  }
  return "";
}

function shouldSkipNode($, el) {
  return (
    $(el).closest(
      "pre, .theme-code-block, nav, .table-of-contents, .theme-doc-toc-desktop, .theme-doc-toc-mobile, .pagination-nav, .theme-doc-footer, .theme-edit-this-page",
    ).length > 0
  );
}

function parseSitemap(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let match;
  while ((match = re.exec(xml))) {
    locs.push(match[1].trim());
  }
  return locs;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return { url: response.url || url, text: await response.text() };
}

async function collectPageUrls() {
  const sitemapUrls = [
    new URL("sitemap.xml", SITE_URL).href,
    new URL("en/sitemap.xml", SITE_URL).href,
  ];
  const found = new Set();
  for (const sitemapUrl of sitemapUrls) {
    try {
      const { text } = await fetchText(sitemapUrl);
      for (const loc of parseSitemap(text)) {
        const fetchUrl = rewriteToSite(loc);
        const path = new URL(fetchUrl).pathname.replace(/\/+$/, "");
        if (path.endsWith("/search") || path.endsWith("\\search")) {
          continue;
        }
        found.add(fetchUrl);
      }
      console.log(`Loaded sitemap ${sitemapUrl} (${found.size} unique URLs so far)`);
    } catch (error) {
      console.warn(`Skip sitemap ${sitemapUrl}: ${error.message}`);
    }
  }
  if (found.size === 0) {
    throw new Error(`No URLs found from sitemaps under ${SITE_URL}`);
  }
  return [...found];
}

async function mapPool(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function emptyHierarchy(lvl0) {
  return {
    lvl0,
    lvl1: null,
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  };
}

function makeObjectID(parts) {
  return createHash("sha1").update(parts.join("::")).digest("hex");
}

function extractRecords(html, fetchedUrl) {
  const $ = cheerio.load(html);
  const language = $('meta[name="docsearch:language"]').attr("content");
  const version = $('meta[name="docsearch:version"]').attr("content") || "current";
  const docusaurusTag =
    $('meta[name="docsearch:docusaurus_tag"]').attr("content") || "";
  if (!language || !docusaurusTag) {
    return [];
  }

  const pageRankRaw = $('meta[name="docsearch:pageRank"]').attr("content");
  const pageRank = Number.parseFloat(pageRankRaw || "0") || 0;

  const article = $("article .theme-doc-markdown, article .markdown, article").first();
  if (!article.length) {
    return [];
  }

  const lvl0 =
    cleanText($(".menu__link--sublist.menu__link--active").first().text()) ||
    cleanText($(".navbar__item.navbar__link--active").first().text()) ||
    "Documentation";

  const urlWithoutAnchor = toRecordUrl(stripHash(fetchedUrl).replace(/\/+$/, "") || fetchedUrl);
  const hierarchy = emptyHierarchy(lvl0);
  const records = [];
  let position = 0;
  let currentAnchor = "";

  function pushRecord(type, content, anchor) {
    position += 1;
    const current = {
      lvl0: hierarchy.lvl0,
      lvl1: hierarchy.lvl1,
      lvl2: hierarchy.lvl2,
      lvl3: hierarchy.lvl3,
      lvl4: hierarchy.lvl4,
      lvl5: hierarchy.lvl5,
      lvl6: hierarchy.lvl6,
    };
    const url = anchor ? `${urlWithoutAnchor}#${anchor}` : urlWithoutAnchor;
    records.push({
      objectID: makeObjectID([urlWithoutAnchor, type, anchor || "", String(position)]),
      hierarchy: current,
      content: content || "",
      type,
      url,
      url_without_anchor: urlWithoutAnchor,
      anchor: anchor || null,
      language,
      lang: language,
      version,
      docusaurus_tag: docusaurusTag,
      weight: {
        pageRank,
        level: LEVEL_WEIGHT[type] ?? 0,
        position,
      },
    });
  }

  const nodes = article
    .find("h1, h2, h3, h4, h5, h6, p, li, td")
    .toArray()
    .filter((el) => !shouldSkipNode($, el));

  for (const el of nodes) {
    const tag = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag.slice(1));
      const text = headingText($, el);
      if (!text) {
        continue;
      }
      const key = `lvl${level}`;
      hierarchy[key] = text;
      for (let i = level + 1; i <= 6; i += 1) {
        hierarchy[`lvl${i}`] = null;
      }
      if (level === 1 && !hierarchy.lvl0) {
        hierarchy.lvl0 = text;
      }
      currentAnchor = headingAnchor($, el);
      pushRecord(key, "", currentAnchor);
      continue;
    }

    if (tag === "p" && $(el).closest("li, td").length) {
      continue;
    }

    const text = contentText($, el);
    if (text.length < 8) {
      continue;
    }
    pushRecord("content", text, currentAnchor);
  }

  if (!records.some((record) => record.type === "lvl1")) {
    const title = cleanText($("article h1").first().text()) || cleanText($("h1").first().text());
    if (title) {
      hierarchy.lvl1 = title;
      records.unshift({
        objectID: makeObjectID([urlWithoutAnchor, "lvl1", "", "0"]),
        hierarchy: emptyHierarchy(lvl0),
        content: "",
        type: "lvl1",
        url: urlWithoutAnchor,
        url_without_anchor: urlWithoutAnchor,
        anchor: null,
        language,
        lang: language,
        version,
        docusaurus_tag: docusaurusTag,
        weight: { pageRank, level: LEVEL_WEIGHT.lvl1, position: 0 },
      });
      records[0].hierarchy.lvl1 = title;
    }
  }

  return records;
}

async function uploadRecords(records) {
  await waitTask(
    (await algoliaJson("PUT", `/1/indexes/${encodeURIComponent(INDEX_NAME)}/settings`, INDEX_SETTINGS))
      .taskID,
  );
  console.log(`Applied DocSearch settings on ${INDEX_NAME}`);

  await waitTask(
    (await algoliaJson("POST", `/1/indexes/${encodeURIComponent(INDEX_NAME)}/clear`)).taskID,
  );
  console.log(`Cleared index ${INDEX_NAME}`);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const slice = records.slice(i, i + BATCH_SIZE);
    const payload = {
      requests: slice.map((body) => ({ action: "addObject", body })),
    };
    const result = await algoliaJson(
      "POST",
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/batch`,
      payload,
    );
    if (result.taskID) {
      await waitTask(result.taskID);
    }
    console.log(`Uploaded ${Math.min(i + slice.length, records.length)}/${records.length} records`);
  }
}

async function searchCheck() {
  const result = await algoliaJson(
    "POST",
    `/1/indexes/${encodeURIComponent(INDEX_NAME)}/query`,
    {
      query: "GPIO",
      hitsPerPage: 3,
      facetFilters: [["language:zh-Hans"], ["docusaurus_tag:docs-default-current"]],
    },
  );
  console.log(
    `Test query GPIO (language:zh-Hans, docusaurus_tag:docs-default-current): ${result.nbHits} hits`,
  );
  for (const hit of result.hits || []) {
    console.log(`  - ${hit.hierarchy?.lvl1 || hit.hierarchy?.lvl0} -> ${hit.url}`);
  }
}

async function main() {
  if (!API_KEY) {
    console.error(
      "Missing ALGOLIA_ADMIN_API_KEY. Copy .env.example to .env and set the Admin (or Write) key.",
    );
    process.exit(1);
  }

  console.log(`Site: ${SITE_URL}`);
  console.log(`Index: ${APP_ID}/${INDEX_NAME}`);
  if (RECORD_ORIGIN) {
    console.log(`Record origin rewrite: ${RECORD_ORIGIN}`);
  }

  const pageUrls = await collectPageUrls();
  console.log(`Crawling ${pageUrls.length} pages...`);

  const pageResults = await mapPool(pageUrls, FETCH_CONCURRENCY, async (pageUrl) => {
    try {
      const { url, text } = await fetchText(pageUrl);
      const records = extractRecords(text, url);
      return { pageUrl, ok: true, records };
    } catch (error) {
      return { pageUrl, ok: false, error: error.message, records: [] };
    }
  });

  const failed = pageResults.filter((item) => !item.ok);
  for (const item of failed) {
    console.warn(`Failed ${item.pageUrl}: ${item.error}`);
  }

  const records = pageResults.flatMap((item) => item.records);
  const pagesWithRecords = pageResults.filter((item) => item.records.length > 0).length;
  const languages = new Map();
  const tags = new Map();
  for (const record of records) {
    languages.set(record.language, (languages.get(record.language) || 0) + 1);
    tags.set(record.docusaurus_tag, (tags.get(record.docusaurus_tag) || 0) + 1);
  }

  console.log(`Pages with DocSearch records: ${pagesWithRecords}`);
  console.log(`Records: ${records.length}`);
  console.log(`Languages: ${JSON.stringify(Object.fromEntries(languages))}`);
  console.log(`docusaurus_tag: ${JSON.stringify(Object.fromEntries(tags))}`);

  if (records.length === 0) {
    throw new Error("No DocSearch records extracted. Check SITE_URL and page meta tags.");
  }

  if (DRY_RUN) {
    console.log("Dry run: skip Algolia upload");
    return;
  }

  await uploadRecords(records);
  await searchCheck();
  console.log("Algolia index update finished.");
}

main().catch((error) => {
  console.error(error.message || error);
  if (/403/.test(String(error.message || ""))) {
    console.error(
      "Algolia returned 403. If this machine uses a proxy, retry off-proxy or from another network.",
    );
  }
  process.exit(1);
});
