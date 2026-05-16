---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Computer Vision

**Teach machines to see -- from image classification to 3D understanding**

- Audience: Students who completed ML (neural networks, PyTorch)
- Deep Learning & NLP recommended (can be taken concurrently)
- Both classic techniques and latest AI approaches

---

# Course Overview

- How does a self-driving car know what's on the road? How does a factory robot spot defects?
- Teach machines to see and understand the visual world
- Classic techniques (still important for many real jobs) and latest AI approaches
- Build systems that detect objects, recognize faces, read documents, generate images
- Run everything in real-time on edge devices

---

# Prerequisites & Self-Check

**Prerequisites:** Machine Learning (neural networks, PyTorch)

**Can you:**
- [ ] Load and display an image using Python?
- [ ] Train a simple neural network in PyTorch (e.g., MNIST)?
- [ ] Explain what a CNN does at a high level (detects visual patterns)?
- [ ] Navigate Jupyter Notebook or Google Colab comfortably?
- [ ] Understand that images are made of pixels (numbers)?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **Core:** PyTorch, torchvision, OpenCV
- **Detection:** Ultralytics (YOLO), Detectron2
- **Foundation Models:** SAM (Segment Anything), Hugging Face
- **Data:** Roboflow, Albumentations
- **Deployment:** ONNX Runtime

---

# Week 0: Seeing Like a Computer

*How computers "see" images -- it's surprisingly different from how we do.*

- What is an image to a computer? (pixels, channels, RGB -- just grids of numbers)
- Image basics with Python: loading, displaying, resizing with OpenCV and PIL
- Quick PyTorch refresher for vision: tensors shaped like images, basic transforms
- Dataset basics: organizing image data (folders, labels, train/test splits)

**What You'll Build:**
- Load your first image and explore its pixel values
- Resize, crop, and change colors of an image using code

---

# Week 1: Foundations of Computer Vision

- What is computer vision? How machines "see" vs how humans see
- Image fundamentals: pixels, channels, color spaces (RGB, HSV, LAB, grayscale)
- Classical image processing with OpenCV:
  - Filtering: blur, sharpen, edge detection (Sobel, Canny)
  - Morphological operations: erosion, dilation, opening, closing
- Histograms and histogram equalization
- Image transformations: affine, perspective, geometric

**What You'll Build:**
- Build an image processing pipeline with OpenCV
- Implement edge detection and contour-based object counting

---

# Week 2: Feature Engineering & Classical Methods

*Deep learning isn't always the answer. Classical methods are faster and more interpretable.*

- Feature descriptors (mathematical descriptions of patterns): HOG, SIFT, SURF, ORB
- Feature matching: brute force, FLANN, RANSAC
- Classical classification: SVM + HOG, Bag of Visual Words
- Optical flow (tracking motion between video frames): Lucas-Kanade, Farneback
- Camera geometry basics: pinhole model, intrinsics, extrinsics

**What You'll Build:**
- Build a feature-based image matching system
- Implement a classical object tracker using optical flow

---

# Week 3: Image Classification with Deep Learning

- CNN architectures: ResNet, EfficientNet, ConvNeXt, ViT, Swin Transformer
- Transfer learning (reusing a model trained on millions of images for your task)
- Fine-tuning strategies: freeze layers, gradual unfreezing, learning rate differential
- Data augmentation: traditional (flip, rotate) + advanced (CutMix, MixUp, RandAugment)
- Real-world challenges: class imbalance, noisy labels, domain shift

**What You'll Build:**
- Fine-tune a ViT model for custom multi-class classification
- Compare CNN vs ViT performance and analyze failure cases

---

# Week 4: Object Detection

- The task: classify + localize simultaneously
- Metrics: IoU (how much predicted box overlaps real box), mAP, precision-recall
- YOLO family deep dive: YOLOv5 through YOLOv12 -- dominates real-time detection
- Transformer-based detection: DETR, Grounding DINO (open-set detection with text prompts)
- Dataset prep: annotation formats (COCO, VOC, YOLO), tools (Roboflow, CVAT)

**What You'll Build:**
- Train YOLOv11 on a custom dataset with Roboflow
- Compare YOLO vs DETR on quality and speed
- Experiment with Grounding DINO for zero-shot detection

---

# Week 5: Image Segmentation

- Semantic (color every pixel), Instance (separate individual objects), Panoptic (both combined)
- Architecture evolution: FCN, U-Net, DeepLab v3+, Mask R-CNN
- SAM (Segment Anything Model): ViT encoder + prompt encoder + mask decoder
  - Prompt types: points, boxes, text, masks
  - SAM 2 (video), SAM 3 (zero-shot, edge deployment)
- SAM + CLIP: combining segmentation with semantic understanding
- Metrics: mIoU (mean Intersection over Union), Dice coefficient

**What You'll Build:**
- Train U-Net for medical image segmentation
- Build a pipeline combining SAM + CLIP for text-prompted segmentation

---

# Week 6: Face & Human Analysis

*Powerful and controversial -- learn to build these systems AND when they should NOT be used.*

- Face detection (MTCNN, RetinaFace) and recognition (ArcFace, FaceNet)
- Facial landmarks, face verification vs identification
- Human pose estimation: OpenPose, MediaPipe, HRNet
- Liveness detection: preventing face spoofing attacks
- Ethics: racial/gender/age bias, deepfake detection, GDPR, EU AI Act prohibitions

**What You'll Build:**
- Build a face verification system with anti-spoofing
- Audit a face recognition model for demographic bias

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- Classical CV and feature engineering
- Image classification with deep learning
- Object detection (YOLO, DETR)
- Segmentation (U-Net, SAM)
- Face and human analysis

---

# Week 8: Video Understanding

*The world doesn't stand still. Video powers surveillance, sports analytics, and autonomous driving.*

- Video as data: frames, temporal dimension, optical flow
- Video classification: 2D CNN + temporal aggregation, 3D CNNs (C3D, I3D), Video Transformers
- Object tracking: SiamFC, DeepSORT, ByteTrack, BoT-SORT
- Tracking-by-detection paradigm
- Video segmentation: SAM 2 for temporal consistency

**What You'll Build:**
- Build a multi-object tracking system with YOLOv11 + ByteTrack
- Implement video classification for action recognition

---

# Week 9: 3D Vision & Depth

*The real world is 3D, but cameras capture 2D. Essential for AR/VR, robotics, autonomous vehicles.*

- Depth estimation: monocular (MiDaS, DPT), stereo vision, LiDAR
- Point clouds: PointNet, PointNet++, 3D object detection
- 3D reconstruction: Structure from Motion (SfM)
- NeRF (Neural Radiance Fields -- creating 3D scenes from 2D photos)
- 3D Gaussian Splatting (faster alternative to NeRF, 2024+)

**What You'll Build:**
- Build monocular depth estimation using MiDaS
- Experiment with 3D Gaussian Splatting for scene reconstruction

---

# Week 10: OCR & Document Understanding

*Billions of documents exist as images. Teaching machines to read them saves enormous time.*

- Text detection (EAST, DBNet) and recognition (CRNN, TrOCR)
- End-to-end OCR: PaddleOCR, EasyOCR, Tesseract
- Document understanding: layout analysis, table extraction, LayoutLM
- Vision-Language Models for documents: GPT-4V, Claude Vision, Gemini
- Invoice processing, receipt extraction, form filling

**What You'll Build:**
- Build a document processing pipeline: detect, recognize, extract structured data
- Create an invoice processing system using OCR + VLM

---

# Week 11: Foundation Models for Vision

*Pre-train once, adapt everywhere. One powerful model for many tasks.*

- CLIP: zero-shot classification with text descriptions, feature extraction
- DINO and DINOv2: self-supervised visual features without labels
- Grounding DINO: open-set object detection with language
- RAM (Recognize Anything Model): universal image tagging
- The trend: combining foundation models (SAM + CLIP, Grounding DINO + SAM)

**What You'll Build:**
- Build a zero-shot visual search system using CLIP
- Create a pipeline: text query, Grounding DINO detection, SAM segmentation

---

# Week 12: Generative Vision

- Text-to-image: Stable Diffusion, DALL-E 3, Flux
- Image editing: inpainting (filling missing parts), outpainting (extending borders), style transfer
- ControlNet, IP-Adapter: controlled image-to-image translation
- Video generation: Sora, Runway, Kling
- Deepfake detection: identifying AI-generated visual content
- Ethics: copyright, consent, misinformation

**What You'll Build:**
- Generate images with Stable Diffusion, experiment with guidance scales
- Use ControlNet for pose-guided and edge-guided generation
- Build a simple deepfake detection system

---

# Week 13: Edge Deployment & Real-Time Vision

*Your model might need to run on a phone, camera, or factory robot -- not a cloud server.*

- Model optimization: quantization (PTQ, QAT), pruning, distillation, NAS
- Edge platforms: NVIDIA Jetson, Intel OpenVINO, Apple Core ML, TF Lite, ONNX Runtime
- Real-time processing: batching, async inference, frame skipping
- Edge-cloud hybrid: lightweight on edge, heavy in cloud
- Industrial applications: quality inspection, autonomous vehicles, surveillance

**What You'll Build:**
- Optimize a model with quantization + pruning for edge
- Deploy real-time object detection on a resource-constrained device

---

# Week 14: Capstone -- End-to-End CV System

- System design for computer vision applications
- Data pipeline: collection, annotation, augmentation, versioning
- Model selection and training strategy
- Deployment architecture: API, edge, batch processing
- Monitoring: drift detection, performance degradation, feedback loops

**What You'll Build:**
- Design and build a complete CV system for a real-world problem
- Full pipeline: data, train, evaluate, optimize, deploy, monitor

---

# Week 15: Capstone Demo

- Students present their end-to-end computer vision system
- Full pipeline from data to deployment to monitoring
- Peer review and instructor feedback

---

# Week 16: Final Exam

- Comprehensive exam covering all material:
  - Classical CV and deep learning classification
  - Detection, segmentation, and face analysis
  - Video understanding, 3D vision, OCR
  - Foundation models and generative vision
  - Edge deployment and system design

---

# Recommended Resources

- **Programming Computer Vision with Python** -- Jan Erik Solem
- **Deep Learning for Vision Systems** -- Mohamed Elgendy
- **Computer Vision: Algorithms and Applications** -- Richard Szeliski
- **Ultralytics YOLO Docs** -- docs.ultralytics.com
- **OpenCV Documentation** -- docs.opencv.org
