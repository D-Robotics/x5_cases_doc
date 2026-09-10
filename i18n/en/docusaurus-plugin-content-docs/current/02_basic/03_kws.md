---
title: Keyword Spotting (KWS)
description: Deploy a zipformer model on the RDK X5 for keyword spotting, detecting wake words in real time.
sidebar_position: 3
---

# Keyword Spotting (KWS)


KWS (Keyword Spotting) detects a specific wake word or keyword in real time. AI algorithms continuously listen to ambient audio and, at low power, quickly detect a preset wake word so a device can leave standby and start voice interaction. KWS is a foundation for smart speakers, assistants, in-vehicle systems, smart homes, and robot voice interaction. It enables button-free wake-up, reduces power consumption, and makes interaction more convenient.

| Hardware | Model | Performance benchmark |
|:---|:---|:---|
| RDK X5<br/>USB speaker / wired headset | [zipformer](https://k2-fsa.github.io/sherpa/onnx/kws/pretrained_models/index.html#sherpa-onnx-kws-zipformer-wenetspeech-3-3m-2024-01-01-chinese) | Keyword: 你好地瓜<br/>RTF (inference_time_seconds/audio_seconds): 0.2 (single-core CPU) |


## Hardware Connection

- Plug a USB speaker into a USB port on the RDK X5 development board.
- Plug a wired headset into the earphone audio jack on the RDK X5 development board.


## Environment Setup

### Install Dependencies

```shell
sudo apt update
sudo apt install libasound2-dev
```

### Build sherpa-onnx

:::warning Caution

- CMake pulls dependency code. Make sure GitHub is reachable; retry if it fails.
- If you have already built it, skip this step.

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

### Get the Sample Code and Build

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/kws_demo_cpp.tar.gz
tar zxvf kws_demo_cpp.tar.gz
cd kws_demo_cpp
cmake -S . -B build
cmake --build build -j6
```

## Run the Sample

:::tip Tip

- This feature captures microphone input for KWS. Try it in a quiet environment. A noise-canceling audio device is recommended.
- The keyword list is in the sample code: `kws_demo_cpp/sherpa-onnx-kws-zipformer-wenetspeech-3.3M-2024-01-01/keywords_raw.txt`
- For custom keywords, see [zipformer](https://k2-fsa.github.io/sherpa/onnx/kws/pretrained_models/index.html#id3).
- To specify the audio device at runtime, see [Earphone Audio Jack](../01_getting_started/06_earphone.md#check-the-device).

:::

```shell
# Run from the kws_demo_cpp directory
./build/kws_microphone --device plughw:0,0
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/kws-run-result.jpg" alt="KWS running result" width="100%" />
