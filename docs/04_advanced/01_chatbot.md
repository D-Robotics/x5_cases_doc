---
title: 聊天机器人
sidebar_position: 1
---

# 聊天机器人


大语言模型（Large Language Model，LLM） 是一种基于深度学习与海量文本数据训练的人工智能模型，具备自然语言理解、生成、推理和知识问答等能力，可理解用户输入的文本或语音信息，并生成符合语义的自然语言回复或执行结果。该技术通过预训练与指令微调学习丰富的语言知识和推理能力，结合上下文信息完成对话交互、内容创作、任务规划、代码生成等多种任务。大语言模型是智能机器人、智能终端、办公助手和 AI 智能体等应用中的核心基础能力，可显著提升设备的自然交互能力、知识服务能力与智能决策水平。

|硬件要求 | 模型选择 | 性能 Benchmark |
|:---|:---|:---|
| RDK X5<br/>USB 音箱/有线耳机 | LLM：[Qwen2.5-1.5b](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)<br/>ASR：[SenseVoice](https://github.com/lovemefan/SenseVoice.cpp)<br/>KWS：[zipformer](https://k2-fsa.github.io/sherpa/onnx/kws/pretrained_models/index.html#sherpa-onnx-kws-zipformer-wenetspeech-3-3m-2024-01-01-chinese)<br/>TTS：[Matcha](https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/matcha.html#matcha-icefall-zh-baker-chinese-1-female-speaker) | Qwen2.5-1.5b：Prefill 22.5TPS/s Gen 5.3TPS/s （8 核 CPU）<br/>ASR：RTF 0.52（8 核 CPU）<br/>KWS：RTF 0.2（单核 CPU）<br/>TTS："你好我是地瓜机器人" 生成耗时：780ms（8 核 CPU） |


## 硬件连接

- 将 USB 音箱接入 RDK X5 开发板的 USB 接口。
- 将有线耳机接入 RDK X5 开发板的 Earphone 音频口。

## 环境准备

### 安装依赖

```shell
#安装依赖
sudo apt install ros-humble-rmw-cyclonedds-cpp
pip install sentencepiece pypinyin
```

### 拉取 LLM 大模型

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/qwen2.5-1.5b-instruct-q5_k_m.gguf
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
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j6
make install .
```

### 编译 llama.cpp

:::warning 注意

- 编译过程中会拉取功能包，请保证网络通畅。
- 如已编译过，可跳过此步骤。

:::

```shell
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/llama.cpp.tar.gz
tar zxvf llama.cpp.tar.gz
cd llama.cpp
cmake -B build
cmake --build build --config Release -j6

mkdir -p chat_ws/src
cd chat_ws/src
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/magicbox_audio_io.tar.gz
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/magicbox_qwen_llm.tar.gz
tar zxvf magicbox_audio_io.tar.gz
tar zxvf magicbox_qwen_llm.tar.gz

#软连接llama.cpp
ln -s /path/to/llama.cpp/ magicbox_qwen_llm/llama.cpp
cd ..

#编译过程中会拉取功能包，请保证网络通畅
source /opt/tros/humble/setup.bash
colcon build --packages-select audio_io --cmake-args -DUSE_LIGHT_CONTROL=OFF
colcon build --packages-select qwen_llm --cmake-args -DPLATFORM_X5=ON
```

## 案例启动

:::info 说明

- 该功能获取麦克风输入，进行 ASR，请在安静的环境中体验，建议使用带去噪的音频设备。
- 运行时指定音频设备请参考 [Earphone 音频口](../01_getting_started/06_earphone.md#查看设备) 章节，更多配置请查看案例代码的 README。
- 暂未支持英文对话。
:::

:::warning 路径与设备均为示例

以下命令中的工作空间路径、模型配置目录、模型文件路径和音频设备名称均为示例值，请根据本机实际环境修改，并在执行前确认对应文件、目录和设备均存在。
:::

### 启动命令参数说明

| 参数或命令 | 作用 | 需确认内容 |
| :--- | :--- | :--- |
| `source /opt/tros/humble/setup.bash` | 加载 RDK X5 的 ROS 2 环境 | 系统环境脚本是否存在 |
| `source chat_ws/install/setup.bash` | 加载聊天机器人工作空间 | `chat_ws` 是否位于当前目录 |
| `ros2 launch audio_io audio_io.launch.py` | 启动音频输入、语音识别和语音合成相关节点 | 工作空间是否已正确编译并加载 |
| `ros2 launch qwen_llm qwen_llm.launch.py` | 启动 LLM 推理节点 | 工作空间是否已正确编译并加载 |
| `micphone_name` | 指定麦克风设备 | 设备名称是否与当前使用的音频设备一致 |
| `tts_config_path` | 指定 TTS 模型配置目录 | 目录是否存在并包含完整模型文件 |
| `asr_model_path` | 指定 ASR 模型文件 | 文件路径和文件名是否正确 |
| `kws_config_path` | 指定 KWS 模型配置目录 | 目录是否存在并包含完整模型文件 |
| `llm_model_path` | 指定 LLM 模型文件 | 修改为下载后的模型文件实际路径 |

```shell
#设置TTS，ASR，KWS模型路径
#启动后加载模型较慢，请稍作等待
source /opt/tros/humble/setup.bash
source chat_ws/install/setup.bash
ros2 launch audio_io audio_io.launch.py micphone_name:=plughw:2,0 tts_config_path:=/root/test/audio_demo/tts_demo_cpp/matcha-icefall-zh-baker asr_model_path:=/root/test/audio_demo/asr_demo_cpp/sense-voice-small-fp16.gguf kws_config_path:=/root/test/audio_demo/kws_demo_cpp/sherpa-onnx-kws-zipformer-wenetspeech-3.3M-2024-01-01
```

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/chatbot-result-screenshot-1.jpg" alt="chatbot-result-screenshot-1" width="100%" />

```shell
#打开另一个终端
#启动后加载模型较慢，请稍作等待
source /opt/tros/humble/setup.bash
source chat_ws/install/setup.bash
ros2 launch qwen_llm qwen_llm.launch.py llm_model_path:=/root/qwen2.5-1.5b-instruct-q5_k_m.gguf
```



<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/chatbot-result-screenshot-2.jpg" alt="chatbot-result-screenshot-2" width="100%" /><br/>

<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/chatbot-result.mp4" type="video/mp4" />
</video>
