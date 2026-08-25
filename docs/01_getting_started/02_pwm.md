---
sidebar_position: 2
---

# PWM 接口

### 接口介绍

PWM（Pulse Width Modulation，脉宽调制）接口提供高精度可编程脉冲信号输出能力，通过调节占空比实现对外部设备的精确控制。该接口可用于驱动舵机、电机、LED 灯、蜂鸣器等执行设备，实现速度调节、位置控制、亮度调节等功能，为机器人运动控制、智能硬件交互及嵌入式应用提供灵活可靠的控制方式。

### 案例目标

通过 PWM 接口控制舵机转动特定角度。

### 设备清单

- RDK X5 开发板
- 公对母杜邦线
- PWM 舵机（180°）：PWM 舵机一种基于脉宽调制（PWM）信号进行位置控制的执行机构，通过接收不同脉宽的控制信号，实现指定角度的精准转动。舵机分为 180° 和 360° 两种，控制信息如下：  

    | 舵机类型 | 0.5ms  | 1.0ms  |1.5ms  | 2.0ms  | 2.5ms  |
    | :---: | :---: | :---: | :---: | :---: | :---: |
    | 180° | 0° | 45° | 90° | 135° |180°|
    | 360° | 顺时针（快速） | 顺时针（慢速） | 逆时针（慢速） | 逆时针（快速） |停止|

### 硬件连接

该案例使用的 MG90S 舵机，黄色为信号线，红色为正极，棕色为负极。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/pwm-hardware-connection.jpg" alt="连接示意图" width="70%" />

#### 接口说明

:::info 说明

舵机接口名称与板端接口号对应关系如下，板端接口号参考 40PIN 管脚定义表中的 BOARD 编码。
:::

| 接口名称 | 板端接口号 |功能说明|
| :---: | :---: | :---: |
| DATA | 32 | PWM 接收 |
| VCC | 1 | 电源 |
| GND | 39 | 地 |

#### 40PIN 管脚定义

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/01_40pin_user_sample/image/40pin_user_sample/image-20241217-202319.png" alt="40PIN 管脚定义" width="100%" />

## 案例代码

创建 `pwm_servo.py` 文件，在 `pwm_servo.py` 文件中粘贴以下代码：

```python
#!/usr/bin/env python3
import sys
import signal
import Hobot.GPIO as GPIO
import time

def signal_handler(signal, frame):
    sys.exit(0)

output_pin = 32

GPIO.setwarnings(False)

def main():
    GPIO.setmode(GPIO.BOARD)
    p = GPIO.PWM(output_pin, 50)
    incr = 0.5
    val = 12.5
    p.start(val)
    print("PWM running. Press CTRL+C to exit.")
    try:
        while True:
            time.sleep(0.25)
            if val >= 12.5:
                incr = -incr
            if val <= 2.5:
                incr = -incr
            val += incr
            print("Duty Cycle: {}".format(val))
            p.ChangeDutyCycle(val)
            p.start(val)
    finally:
        p.stop()
        GPIO.cleanup()

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    main()
```

## 运行案例

使用以下命令运行案例代码：

```shell
python3 pwm_servo.py
```

运行后舵机在 0-180° 之间来回转动。

<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/pwm-running-result.mp4" type="video/mp4" />
</video>
