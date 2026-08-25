---
sidebar_position: 4
---

# 1. 文字转语音（TTS）

TTS（Text To Speech，文本转语音）即语音合成技术，是一种将文本信息转换为自然流畅语音的技术，通过人工智能算法模拟人类发音方式，实现文字内容的实时语音播报。TTS 是智能助手、人机交互、智能客服、车载系统和机器人语音交互等应用的重要基础，可提升设备的信息传递能力与自然交互体验。

|硬件要求 | 模型选择 | 性能 Benchmark |
|:---|:---|:---|
| RDK X5<br/>USB 音箱/有线耳机 | [Matcha](https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/matcha.html#matcha-icefall-zh-baker-chinese-1-female-speaker) | 生成内容：你好我是地瓜机器人（2044ms）<br/>生成耗时：780ms（8 核 CPU） |


## 硬件连接

- 将 USB 音箱接入 RDK X5 开发板的 USB 接口。
- 将有线耳机接入 RDK X5 开发板的 Earphone 音频口。

## 环境准备

### 安装依赖

```shell
#安装依赖
sudo apt update
sudo apt install libasound2-dev
```

### 编译 sherpa-onnx

:::warning 注意

- cmake 会拉取依赖代码，请保证访问 github 正常，失败则多尝试几次。
- 如已编译过，可跳过此步骤。

:::

```shell
git clone https://github.com/k2-fsa/sherpa-onnx.git
cd sherpa-onnx
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j6
make install .
```

### 获取案例代码并编译

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/tts_demo_cpp.tar.gz
tar zxvf tts_demo_cpp.tar.gz
cd tts_demo_cpp
cmake -S . -B build
cmake --build build -j6
```

## 案例启动

:::tip 提示

- 该功能根据输入的文字生成音频，并通过扬声器播放。
- 运行时指定音频设备请参考 [Earphone 音频口](../getting_started/earphone#查看设备) 章节。
- 启动后需要加载模型，请稍作等待。
:::

```shell
#在 tts_demo_cpp 路径下运行
./build/tts_play --text '你好我是地瓜机器人' --device plughw:0,0
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/tts-run-result.jpg" alt="tts-run-result" width="100%" />
