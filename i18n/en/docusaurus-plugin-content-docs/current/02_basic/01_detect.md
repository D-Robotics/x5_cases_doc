---
sidebar_position: 1
---

# Object Detection


Object Detection is a core computer-vision task. It identifies and localizes objects in images or video (such as people, vehicles, and animals), usually with bounding boxes. It is widely used in security monitoring, autonomous driving, and industrial inspection. Representative models include YOLO, R-CNN, and DETR.

| Hardware | Model | Performance benchmark |
| :--- | :--- | :---|
| RDK X5<br/>USB camera | YOLO11m | 28.95 fps |

:::info Note

This case is for a quick object-detection trial. The model is not performance-optimized.

:::

## Hardware Connection

Plug the USB camera into a USB port on the RDK X5 development board.

## Environment Setup


```shell
# Download yolo11m_demo.tar and extract it on the board
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/yolo11m_demo.tar.gz
tar zxvf yolo11m_demo.tar.gz
```

## Run the Sample

:::warning Caution
This case must be started from MobaXterm or the system desktop. A terminal that cannot display a window will report an error.
:::

```shell
# Enter the specified folder
cd yolo11m_demo/runtime/python

# Test with the default image
python3 main.py

# Test with the camera
python3 main.py --camera-id 0
```

After it starts, the detection result is displayed.

<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/detect-running-result.mp4" type="video/mp4" />
</video>
