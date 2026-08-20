---
sidebar_position: 1
---

# GPIO 接口

### 接口介绍

GPIO（General Purpose Input/Output）接口提供灵活的通用数字信号扩展能力，支持输入、输出模式配置，可用于连接传感器、按键、指示灯、继电器及各类外部控制设备。通过软件可实现对外部设备的状态检测与控制，为系统提供丰富的硬件交互能力，满足机器人控制、智能终端及嵌入式应用中的扩展需求。

### 案例目标

通过 GPIO 捕获按钮按压事件。


### 设备清单

- RDK X5 开发板
- 母对母杜邦线
- GPIO 按钮模块

### 硬件连接

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/gpio-hardware-connection.jpg" alt="硬件连接示意图" width="100%" />

#### 接口说明

:::info 说明

按钮模块接口名称与板端接口号对应关系如下，板端接口号参考 40PIN 管脚定义表中的 BOARD 编码。

:::

| 按钮模块接口 | 板端接口号 |功能说明|
| :---: | :---: | :---: |
| OUT | 11 | 电平输出 |
| VCC | 1 | 电源 |
| GND | 39 | 地 |

#### 40PIN 管脚定义

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/01_40pin_user_sample/image/40pin_user_sample/image-20241217-202319.png" alt="40PIN 管脚定义" width="100%" />



## 案例代码

创建 `gpio_button.py` 文件，在 `gpio_button.py` 文件中粘贴以下代码：

```python
#!/usr/bin/env python3
import sys
import signal
import Hobot.GPIO as GPIO
import time

def signal_handler(signal, frame):
    sys.exit(0)

# 此处使用 11号的 GPIO 引脚
input_pin = 11 
GPIO.setwarnings(False)

def main():
    prev_value = None

    # 设置管脚编码模式为硬件编号 BOARD
    GPIO.setmode(GPIO.BOARD)
    # 设置为输入模式
    GPIO.setup(input_pin, GPIO.IN)

    #等待按钮按压事件（GPIO 按钮模块在按压时会输出低电平）
    GPIO.wait_for_edge(input_pin, GPIO.FALLING)
    print("Starting demo now! Press CTRL+C to exit")
    GPIO.cleanup()

if __name__=='__main__':
    signal.signal(signal.SIGINT, signal_handler)
    main()
```

## 运行案例

使用以下命令运行案例代码：

```shell
python3 gpio_button.py
```

按压按钮后打印 “Starting demo now! Press CTRL+C to exit”，按下 Ctrl+C 退出程序。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/gpio-running-result.jpg" alt="运行结果" width="80%" />