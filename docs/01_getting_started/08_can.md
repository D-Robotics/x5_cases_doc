---
sidebar_position: 8
---

# CAN 接口

### 接口介绍

CAN（Controller Area Network，控制器局域网络）是一种面向实时控制的串行通信总线，通过差分信号线（CAN_H、CAN_L）实现多个设备之间的数据交换。该接口具有抗干扰能力强、通信可靠性高、支持多节点组网等特点，可在无需主机仲裁的情况下实现设备间实时通信，广泛应用于汽车电子、工业控制、机器人、智能设备及运动控制等场景。

### 案例目标

通过 CAN 接口控制电机转动。

### 设备清单

- RDK X5 开发板
- 跳线帽
- CAN 电机（[GM6020](https://www.robomaster.com/zh-CN/products/components/general/gm6020)）
- 电调中心板
- 24V 电源适配器

### 硬件连接


<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/can-hardware-connection.jpg" alt="连接示意图" width="40%" /><br/>

:::info 说明

两个设备之间 can 线长度超过 1 米或速率超过 125Kbps，需闭合终端电阻开关，此案例使用 GM6020 电机，速率为 1Mbps，所以使用跳线帽闭合 120 欧姆终端电阻开关。
- RDK X5 开发板端子接口型号：SH1.0 1X3P
- GM6020 端子接口型号：GH1.25mm2P
:::


## 依赖安装与环境设置

```shell
#安装依赖
pip install python-can
pip install -U typing_extensions

#设置can设备
sudo ip link set can0 up type can bitrate 1000000
```

## 案例代码


创建 `can_motor.py` 文件，在 `can_motor.py` 文件中粘贴以下代码：

```python
#!/usr/bin/env python3

import can
import time
import argparse

def parse_args():
    parser = argparse.ArgumentParser(
        description="GM6020 CAN control"
    )
    parser.add_argument(
        "--channel",
        default="can0"
    )
    parser.add_argument(
        "--motor",
        type=int,
        default=1,
        help="motor id 1-7"
    )
    parser.add_argument(
        "--voltage",
        type=int,
        default=0,
        help="-30000~30000"
    )
    return parser.parse_args()

class GM6020:

    def __init__(self, channel, motor_id):
        self.bus = can.interface.Bus(
            channel=channel,
            interface="socketcan"
        )
        self.id = motor_id

    def send_voltage(self, value):
        value = max(
            -30000,
            min(30000,value)
        )
        data=[0]*8
        index=self.id-1
        data[index*2] = (
            value >> 8
        ) & 0xff
        data[index*2+1] = (
            value
        ) & 0xff
        msg=can.Message(
            arbitration_id=0x1FF,
            data=data,
            is_extended_id=False
        )
        self.bus.send(msg)

    def read_feedback(self):
        while True:
            msg=self.bus.recv(
                timeout=0.1
            )
            if msg is None:
                continue
            if msg.arbitration_id == (
                0x204+self.id
            ):
                data=msg.data
                angle = (
                    data[0]<<8
                    | data[1]
                )
                speed = (
                    data[2]<<8
                    | data[3]
                )
                current = (
                    data[4]<<8
                    | data[5]
                )
                temp=data[6]
                if speed>32767:
                    speed-=65536
                if current>32767:
                    current-=65536
                return {
                    "angle_raw":angle,
                    "angle_deg":
                    angle*360/8192,
                    "speed":
                    speed,
                    "current":
                    current,
                    "temperature":
                    temp
                }
    def close(self):
        if self.bus is not None:
            self.bus.shutdown()
            print("CAN bus closed")
            
def main():
    args=parse_args()
    motor=GM6020(
        args.channel,
        args.motor
    )
    print(
        "GM6020 start"
    )
    try:
        while True:
            # 控制
            motor.send_voltage(
                args.voltage
            )
            #读取
            state=motor.read_feedback()
            print(
                state
            )
            time.sleep(
                0.02
            )
    except KeyboardInterrupt:
        print("Exit by user")
    finally:
        motor.close()

if __name__=="__main__":

    main()
```

## 运行案例

使用以下命令运行案例代码：

```shell
python3 can_motor.py --motor 1 --voltage 5000
```

运行后电机会按照指定的方向和速度转动，并打印当前电机状态。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/can-running-result.jpg" alt="运行结果" width="60%" /><br/>
<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/can-running-result.mp4" type="video/mp4" />
</video>
