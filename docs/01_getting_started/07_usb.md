---
title: USB 接口
description: 使用 RDK X5 的 USB 接口接入 USB 摄像头并实时显示画面。
sidebar_position: 7
---

# USB 接口

## 接口介绍
USB 接口采用标准 USB 通信协议，支持设备供电与高速数据传输，可方便连接摄像头、键盘、鼠标、U 盘、无线网卡、音箱等丰富外设，具备良好的兼容性与扩展性。根据接口规格不同，可提供最高数 Gbps 级的数据传输带宽，满足高速数据采集、模型部署、外设接入及调试开发等多种应用需求，为系统提供灵活、便捷的外设扩展能力。

## 案例目标
通过 USB 接口调用摄像头并实时显示。

## 设备清单
- RDK X5 开发板
- USB 摄像头

## 硬件连接
将 USB 摄像头插入 RDK X5 开发板的 USB 接口。

## 创建 usb_camera.py 文件

创建 `usb_camera.py` 文件，在 `usb_camera.py` 文件中粘贴以下代码：

并粘贴代码

```python
import cv2

# 打开USB摄像头
# 0表示默认摄像头，如果有多个摄像头可以改为1、2...
cap = cv2.VideoCapture(0)

# 检查摄像头是否打开成功
if not cap.isOpened():
    print("无法打开USB摄像头")
    exit()

# 设置摄像头分辨率（可选）
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("USB摄像头启动成功，按 q 退出")
try:
    while True:
        # 读取一帧图像
        ret, frame = cap.read()

        if not ret:
            print("读取摄像头数据失败")
            break

        # 显示图像
        cv2.imshow("USB Camera", frame)

        # 按q退出
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
except KeyboardInterrupt:
    print("\n程序被用户中断，正在退出...")
finally:
    # 释放资源
    cap.release()
    cv2.destroyAllWindows()
```

## 运行案例

:::warning 注意

该案例需要在 MobaXterm 或系统桌面端启动，不支持显示的终端窗口会报错。

:::

使用以下命令运行案例代码：

```shell
python3 usb_camera.py
```





运行后摄像头会实时显示画面。

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/usb-running-result.jpg" alt="运行结果" width="60%" />
