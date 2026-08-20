---
sidebar_position: 3
---

# UART 接口

### 接口介绍

UART（Universal Asynchronous Receiver/Transmitter，通用异步收发传输器）接口提供稳定可靠的串行通信能力，支持设备间进行数据收发与信息交互。该接口具有结构简单、易于扩展、兼容性强等特点，可用于连接传感器、通信模块、调试设备及其他嵌入式外设，实现系统状态监测、数据传输与设备控制。

### 案例目标

通过 UART 接口进行回环测试，RDK X5 开发板使用设备路径为 `/dev/ttyS1`。

### 设备清单

- RDK X5 开发板
- 跳线帽

### 硬件连接

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/uart-hardware-connection.jpg" alt="连接示意图" width="80%" />

#### 接口说明


:::info 说明

正常使用中，外接设备的 RX 端口接开发板的 TX 端口，设备的 TX 端口接开发板的 RX 端口。

:::

| 接口名称 | 板端接口号 | 功能说明 |
| :---: | :---: | :---: |
| UART_TX | 8 | 发送端口 |
| UART_RX | 10 | 接收端口 |

#### 40PIN 管脚定义

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/03_Basic_Application/01_40pin_user_sample/image/40pin_user_sample/image-20241217-202319.png" alt="40PIN 管脚定义" width="100%" />

## 案例代码

创建 `uart_loopback.py` 文件，在 `uart_loopback.py` 文件中粘贴以下代码：

```python
#!/usr/bin/env python3

import sys
import signal
import os
import time

# 导入python串口库
import serial
import serial.tools.list_ports

def signal_handler(signal, frame):
    sys.exit(0)

def serialTest():
    print("List of enabled UART:")
    #X5使用/dev/ttyS1
    uart_dev= "/dev/ttyS1"

    baudrate = input("请输入波特率(9600,19200,38400,57600,115200,921600):")
    try:
        ser = serial.Serial(uart_dev, int(baudrate), timeout=1) # 1s timeout
    except Exception as e:
        print("open serial failed!\n")

    print(ser)

    print("Starting demo now! Press CTRL+C to exit")

    while True:
        test_data = "AA55"
        write_num = ser.write(test_data.encode('UTF-8'))
        print("Send: ", test_data)

        received_data = ser.read(write_num).decode('UTF-8')
        print("Recv: ", received_data)

        time.sleep(1)

    ser.close()
    return 0

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    if serialTest() != 0:
        print("Serial test failed!")
    else:
        print("Serial test success!")
```

## 运行案例

使用以下命令运行案例代码：

```shell
python3 uart_loopback.py
```

运行后可选择波特率，并持续打印收发信息 `AA55`。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/uart-running-result.jpg" alt="运行结果" width="100%" />
