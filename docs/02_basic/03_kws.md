---
sidebar_position: 3
---

# 关键词唤醒（KWS）


KWS（Keyword Spotting，关键词唤醒）即关键词检测技术，是一种实时识别特定唤醒词或关键词的语音识别技术，通过人工智能算法持续监听环境语音，在低功耗条件下快速检测预设的唤醒词，实现设备从待机状态进入语音交互状态。KWS 是智能音箱、智能助手、车载系统、智能家居和机器人语音交互等应用的重要基础，可实现免按键唤醒，降低功耗，提升设备的交互便捷性与用户体验。

|硬件要求 | 模型选择 | 性能 Benchmark |
|:---|:---|:---|
| RDK X5<br/>USB 音箱/有线耳机 | [zipformer](https://k2-fsa.github.io/sherpa/onnx/kws/pretrained_models/index.html#sherpa-onnx-kws-zipformer-wenetspeech-3-3m-2024-01-01-chinese) | 识别关键词：你好地瓜<br/>RTF（inference_time_seconds/audio_seconds）：0.2（单核 CPU） |


## 硬件连接

- 将 USB 音箱接入 RDK X5 开发板的 USB 接口。
- 将有线耳机接入 RDK X5 开发板的 Earphone 音频口。


## 环境准备

### 安装依赖

```shell
sudo apt update
sudo apt install libasound2-dev
```

### 编译 sherpa-onnx

:::warning 注意

- cmake 会拉取依赖代码，请保证访问 github 正常，失败则多尝试几次。
- 如已编译过，可跳过此步骤。

:::

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/sherpa-onnx.tar.gz
tar zxvf sherpa-onnx.tar.gz
cd sherpa-onnx
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j6
make install .
```

### 获取案例代码并编译

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/kws_demo_cpp.tar.gz
tar zxvf kws_demo_cpp.tar.gz
cd kws_demo_cpp
cmake -S . -B build
cmake --build build -j6
```

## 案例启动

:::tip 提示

- 该功能获取麦克风输入，进行 KWS，请在安静的环境中体验，建议使用带去噪的音频设备。
- 关键词列表见案例代码：kws_demo_cpp/sherpa-onnx-kws-zipformer-wenetspeech-3.3M-2024-01-01/keywords_raw.txt
- 自定义关键词方法见 [zipformer](https://k2-fsa.github.io/sherpa/onnx/kws/pretrained_models/index.html#id3) 。
- 运行时指定音频设备请参考 [Earphone 音频口](../getting_started/earphone#查看设备) 章节。

:::

```shell
#在kws_demo_cpp路径下运行
./build/kws_microphone --device plughw:0,0
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/kws-run-result.jpg" alt="kws-run-result" width="100%" />
