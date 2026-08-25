---
sidebar_position: 2
---

# 1. Speech-to-Text (ASR)


ASR (Automatic Speech Recognition) converts spoken language into text in real time. It is a foundation for voice assistants, meeting notes, intelligent customer service, and voice input.

| Hardware | Model | Performance benchmark |
|:---|:---|:---|
| RDK X5<br/>USB speaker / wired headset | [SenseVoice](https://github.com/lovemefan/SenseVoice.cpp) | RTF (inference_time_seconds/audio_seconds): 0.52 (8-core CPU) |

## Hardware Connection

- Plug a USB speaker into a USB port on the RDK X5 development board.
- Plug a wired headset into the earphone audio jack on the RDK X5 development board.

## Environment Setup

### Install Dependencies

```shell
sudo apt update
sudo apt install libasound2-dev
```

### Get the Sample Code and Build

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/asr_demo_cpp.tar.gz
tar zxvf asr_demo_cpp.tar.gz
cd asr_demo_cpp
cmake -S . -B build
cmake --build build -j6
```

## Run the Sample

:::tip Tip

- This feature captures microphone input for ASR. Try it in a quiet environment. A noise-canceling audio device is recommended.
- To specify the audio device at runtime, see [Earphone Audio Jack](../01_getting_started/06_earphone.md#check-the-device). For more configuration, see the README in the sample code.
- If ASR cannot recognize speech, try lowering `threshold` and `vad-threshold`.

:::

```shell
# Run from the asr_demo_cpp directory
./build/asr_microphone --device plughw:0,0 --threshold 0.03 --vad-threshold 0.5
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/asr-run-result.jpg" alt="ASR running result" width="100%" />
