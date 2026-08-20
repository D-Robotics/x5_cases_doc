---
sidebar_position: 2
---

# 语音转文字（ASR）


ASR（Automatic Speech Recognition，自动语音识别）即语音转文字技术，是一种将人类语音实时转换为文本的技术，是语音助手、会议纪要、智能客服和语音输入等应用的重要基础。

|硬件要求 | 模型选择 | 性能 Benchmark |
|:---|:---|:---|
| RDK X5<br/>USB 音箱/有线耳机 | [SenseVoice](https://github.com/lovemefan/SenseVoice.cpp) | RTF（inference_time_seconds/audio_seconds）：0.52（8 核 CPU） |

## 硬件连接

- 将 USB 音箱接入 RDK X5 开发板的 USB 接口。
- 将有线耳机接入 RDK X5 开发板的 Earphone 音频口。

## 环境准备

### 安装依赖

```shell
sudo apt update
sudo apt install libasound2-dev
```

### 获取案例代码并编译

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/asr_demo_cpp.tar.gz
tar zxvf asr_demo_cpp.tar.gz
cd asr_demo_cpp
cmake -S . -B build
cmake --build build -j6
```

## 案例启动

:::tip 提示

- 该功能获取麦克风输入，进行 ASR，请在安静的环境中体验，建议使用带去噪的音频设备。
- 运行时指定音频设备请参考 [Earphone 音频口](../getting_started/earphone#查看设备) 章节，更多配置请查看案例代码的 README。
- 若 ASR 识别不到，可尝试降低 threshold 和 vad-threshold。

:::

```shell
#在asr_demo_cpp路径下运行
./build/asr_microphone --device plughw:0,0 --threshold 0.03 --vad-threshold 0.5
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/asr-run-result.jpg" alt="asr-run-result" width="100%" />
