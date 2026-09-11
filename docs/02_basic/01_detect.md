---
title: 目标检测
description: 使用 RDK X5 部署 YOLO11m 模型进行目标检测，识别并定位图像中的目标对象。
sidebar_position: 1
---

# 目标检测


Object Detection 是计算机视觉中的核心任务，主要用于从图像或视频中识别并定位目标对象（如人、车辆、动物等），通常通过边界框标注目标位置。其广泛应用于安防监控、自动驾驶、工业质检等场景，代表模型包括 YOLO、R-CNN、DETR 等系列。

| 硬件要求 | 模型选择 | 性能 Benchmark |
| :--- | :--- | :---|
| RDK X5<br/>USB 摄像头 | YOLO11m | 28.95fps |

:::info 说明

此案例用于快速体验目标检测功能，模型未做性能优化。

:::

## 硬件连接

将 USB 摄像头接入 RDK X5 开发板的 USB 接口。

## 环境准备


```shell
#下载 yolo11m_demo.tar 并解压到板端
wget https://archive.d-robotics.cc/downloads/rdk_demo/rdk_x5_demo/yolo11m_demo.tar.gz
tar zxvf yolo11m_demo.tar.gz
```

## 案例启动

:::warning 注意
需要在 MobaXterm 或系统桌面端启动，不支持显示的终端窗口会报错。
:::

```shell
#进入指定文件夹
cd yolo11m_demo/runtime/python

#使用默认图片进行测试
python3 main.py

#使用相机进行测试
python3 main.py --camera-id 0
```

运行后会显示检测结果。

<video controls width="100%" preload="metadata">
  <source src="https://rdk-doc.oss-cn-beijing.aliyuncs.com/doc/img/samples/x5/zh/detect-running-result.mp4" type="video/mp4" />
</video>
