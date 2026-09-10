---
title: RDK X5 Application Case Guide
description: A curated collection of RDK X5 application cases, from peripheral interfaces to on-device AI inference and multimodal interaction, organized by difficulty.
sidebar_position: 1
---

# RDK X5 Application Case Guide

This document collects typical application cases for the RDK X5 platform. It is organized by increasing difficulty, from basic peripheral interfaces to on-device AI inference, then to interactive games and a multimodal chatbot, so you can get started quickly and go deeper step by step.

## Document Structure

### Getting Started Cases

These cases introduce how to connect and use common onboard peripheral interfaces. Interface numbers use BOARD numbering.

- **[GPIO](./01_getting_started/01_gpio.md)**: Capture button press events
- **[PWM](./01_getting_started/02_pwm.md)**: Servo angle control
- **[UART](./01_getting_started/03_uart.md)**: UART loopback test
- **[I2C](./01_getting_started/04_i2c.md)**: OLED display
- **[SPI](./01_getting_started/05_spi.md)**: SPI screen animation / image display
- **[Earphone Audio Jack](./01_getting_started/06_earphone.md)**: Recording and playback
- **[USB](./01_getting_started/07_usb.md)**: USB camera capture
- **[CAN](./01_getting_started/08_can.md)**: GM6020 motor control

### Basic Cases

These cases deploy entry-level AI models on RDK X5, covering typical vision detection and speech scenarios.

- **[Detect](./02_basic/01_detect.md)**: YOLO11m object detection (image / camera)
- **[ASR](./02_basic/02_asr.md)**: SenseVoice speech-to-text
- **[KWS](./02_basic/03_kws.md)**: Keyword spotting (你好地瓜)
- **[TTS](./02_basic/04_tts.md)**: Matcha text-to-speech

### Intermediate Cases

- **[Gesture Interaction Game](./03_intermediate/01_gesture_game.md)**: Body detection + hand landmarks + gesture recognition, with a browser-based interactive experience on TROS.

### Advanced Cases

- **[Chatbot](./04_advanced/01_chatbot.md)**: Multimodal voice dialogue with KWS + ASR + LLM + TTS
