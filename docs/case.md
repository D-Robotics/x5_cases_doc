---
sidebar_position: 1
slug: /case
---

# RDK X5 应用案例手册

本文档汇总 RDK X5 平台典型应用案例，从基础外设接口到端侧 AI 推理，再到交互游戏与多模态聊天机器人，按难度递进组织，便于快速上手并逐层深入。

## 文档结构

### 入门案例

介绍常用板端外设接口的接入与使用方法，统一使用 BOARD 编码标注接口序号。

- **[GPIO 接口](./01_getting_started/01_gpio.md)**：按钮按压事件捕获
- **[PWM 接口](./01_getting_started/02_pwm.md)**：舵机角度控制
- **[UART 接口](./01_getting_started/03_uart.md)**：串口自发自收验证
- **[I2C 接口](./01_getting_started/04_i2c.md)**：OLED 显示
- **[SPI 接口](./01_getting_started/05_spi.md)**：SPI 屏幕动画/图片显示
- **[Earphone 音频口](./01_getting_started/06_earphone.md)**：录音与播放
- **[USB 接口](./01_getting_started/07_usb.md)**：USB 摄像头采集
- **[CAN 接口](./01_getting_started/08_can.md)**：GM6020 电机控制

### 初阶案例

在 RDK X5 端侧部署入门级 AI 模型，覆盖视觉检测与语音三类典型场景。

- **[Detect](./02_basic/01_detect.md)**：YOLO11m 目标检测（图片/摄像头）
- **[ASR](./02_basic/02_asr.md)**：SenseVoice 语音转文字
- **[KWS](./02_basic/03_kws.md)**：关键词唤醒（你好地瓜）
- **[TTS](./02_basic/04_tts.md)**：Matcha 文本转语音

### 进阶案例

- **[手势交互小游戏](./03_intermediate/01_gesture_game.md)**：人体检测 + 人手关键点 + 手势识别，基于 TROS 的浏览器交互体验。

### 高阶案例

- **[聊天机器人](./04_advanced/01_chatbot.md)**：KWS + ASR + LLM + TTS 多模态语音对话

