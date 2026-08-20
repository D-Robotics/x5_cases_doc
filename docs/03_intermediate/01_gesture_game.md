---
sidebar_position: 1
---

# 手势交互小游戏

手势交互（Gesture Interaction）即通过计算机视觉与人工智能技术识别人类手部动作、姿态及行为意图，并将其转换为设备可理解的控制指令，实现人与机器之间的自然交互。该技术通过摄像头设备获取手势信息，结合算法进行实时分析与识别，可实现设备控制、指令输入、状态切换等功能。手势交互是智能机器人、人机协作、智能终端和虚拟现实等应用中的重要交互方式，可提升设备操作的便捷性与智能化水平。

|硬件要求 | 模型选择 | 性能 Benchmark |
|:---|:---|:---|
| RDK X5<br/>USB 摄像头 | 人体检测：[fastrcnn](https://developer.d-robotics.cc/tros_doc/boxs/body/mono2d_body_detection?v=3.5.0&p=RDK+X5)<br/>人手关键点检测：[handLMKs](https://developer.d-robotics.cc/tros_doc/boxs/body/hand_lmk_detection?v=3.5.0&p=RDK+X5)<br/>手势识别：[gestureDet](https://developer.d-robotics.cc/tros_doc/boxs/body/hand_gesture_detection?v=3.5.0&p=RDK+X5) | fastrcnn：125.21fps<br/>handLMKs：948fps<br/>gestureDet：1252.44fps |

## 识别流程

该功能包含了人体检测，人手关键点检测和手势识别三个部分，并且用到了 ROS，整体识别拆分成多个节点做各类识别，该功能已经封装在 TROS 包中，流程如下：

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/gesture-game-pipeline.png" alt="gesture-game-pipeline" width="100%" />

消息类型为 PerceptionTargets，手势消息的处理，可参考案例代码中的 `on_gesture_msg` 函数，案例代码获取见 [环境准备](#环境准备) 。

## 手势说明

| Gesture | Description | Value |
| --- | --- | --- |
| ThumbUp | Thumb up gesture | 2 |
| Victory | "V" gesture | 3 |
| Mute | "Shh" gesture | 4 |
| Palm | Palm gesture | 5 |
| Okay | OK gesture | 11 |
| ThumbLeft | Thumb pointing left | 12 |
| ThumbRight | Thumb pointing right | 13 |
| Awesome | 666 gesture | 14 |

## 硬件连接

将 USB 摄像头接入 RDK X5 开发板的 USB 接口。

## 环境准备

### 安装依赖

```shell
sudo apt update
sudo apt install python3-colcon-common-extensions
```

### 创建工作空间，获取代码

```shell
mkdir -p gesture_game_ws/src
cd gesture_game_ws/src
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/gesture_game_web.tar.gz
tar zxvf gesture_game_web.tar.gz
cd ..
source /opt/tros/humble/setup.bash
colcon build
```

## 案例启动

```shell
source /opt/tros/humble/setup.bash

# 从tros.b的安装路径中拷贝出运行示例需要的配置文件。
cp -r /opt/tros/${TROS_DISTRO}/lib/mono2d_body_detection/config/ .
cp -r /opt/tros/${TROS_DISTRO}/lib/hand_lmk_detection/config/ .
cp -r /opt/tros/${TROS_DISTRO}/lib/hand_gesture_detection/config/ .

# 配置USB摄像头
export CAM_TYPE=usb

source install/setup.bash
# 启动launch文件
ros2 launch gesture_game_web gesture_game.launch.py
```

## 效果展示

:::tip 提示
启动后在 PC 的浏览器中查看效果，需要 PC 与板端能够互相 ping 通。
:::

**`板端 IP:8000` 查看算法识别效果**


<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/gesture-detection-result.jpg" alt="gesture-detection-result" width="80%" />

**`板端 IP:8088` 体验手势交互游戏**

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/gesture-game-result.jpg" alt="gesture-game-result" width="80%" /><br/>

<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/game.mp4" type="video/mp4" />
</video>