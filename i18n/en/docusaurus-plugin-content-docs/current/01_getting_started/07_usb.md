---
sidebar_position: 7
---

# USB Interface

### Interface Overview

The USB interface uses the standard USB protocol and supports both power delivery and high-speed data transfer. It can connect cameras, keyboards, mice, USB drives, wireless adapters, speakers, and many other peripherals, with good compatibility and expandability. Depending on the connector specification, it can provide multi-Gbps bandwidth for high-speed data capture, model deployment, peripheral access, and debugging.

### Case Objective

Open a USB camera and display the video stream in real time.

### Required Hardware

- RDK X5 development board
- USB camera

### Hardware Connection


Plug the USB camera into a USB port on the RDK X5 development board.

## Create usb_camera.py

Create a `usb_camera.py` file and paste the following code:

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

## Run the Sample

:::warning Caution

This case must be started from MobaXterm or the system desktop. A terminal that cannot display a window will report an error.

:::

Run the sample with the following command:

```shell
python3 usb_camera.py
```





After it starts, the camera stream is displayed in real time.

<img src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/usb-running-result.jpg" alt="Running result" width="60%" />
