# Computer Vision

**Teach machines to see — from image classification to 3D understanding**

---

## Course Overview

This course provides specialized, in-depth training in computer vision, going far beyond what's covered in Deep Learning & NLP. Students will master the complete spectrum of visual understanding: from classical image processing to cutting-edge foundation models like SAM 3, CLIP, and Vision-Language Models. The course emphasizes both traditional techniques (which remain essential for many industrial applications) and modern deep learning approaches, with a strong focus on practical deployment including edge AI and real-time processing.

In 2026, computer vision is experiencing a major shift toward foundation models and multimodal AI, making systems smarter, more flexible, and accessible even without large training datasets.

---

## Prerequisites

- Machine Learning (Semester 2) — neural networks, PyTorch
- Deep Learning & NLP recommended (CNNs, Transformers) but can be taken concurrently

### Self-Check: Am I Ready?

Before starting this course, make sure you can:
- [ ] Load and display an image using Python (any library)
- [ ] Train a simple neural network in PyTorch on a dataset like MNIST
- [ ] Explain what a CNN (Convolutional Neural Network) does at a high level (it detects visual patterns)
- [ ] Navigate a Jupyter Notebook or Google Colab environment comfortably
- [ ] Understand what "pixels" are and that images are made of numbers

If you can't check all boxes, don't worry! Week 0 covers these foundations.

## Tools & Technologies

PyTorch, torchvision, OpenCV, Ultralytics (YOLO), Hugging Face, Roboflow, Albumentations, ONNX Runtime, Detectron2, Segment Anything (SAM)

---

## Weekly Schedule

---

### Week 0: Seeing Like a Computer

*Welcome! This week introduces how computers "see" images — it's surprisingly different from how we do. No prior image processing experience needed.*

**Topics:**
- What is an image to a computer? (pixels, channels, RGB — images are just grids of numbers)
- Image basics with Python: loading, displaying, and resizing images with OpenCV and PIL
- Quick PyTorch refresher for vision tasks: tensors shaped like images, basic transforms
- Dataset basics: how to organize image data (folders, labels, train/test splits)

**What You'll Build:**
- Load your first image in Python and explore its pixel values
- Resize, crop, and change the colors of an image using code
- Create a small organized image dataset ready for training

---

### Week 1: Foundations of Computer Vision

**Topics:**
- What is computer vision? How machines "see" vs how humans see
- Image fundamentals: pixels, channels, color spaces (RGB, HSV, LAB, grayscale)
- Image as tensors: how images become numbers for neural networks
- Classical image processing with OpenCV:
  - Filtering: blur, sharpen, edge detection (Sobel, Canny)
  - Morphological operations: erosion, dilation, opening, closing
  - Thresholding, contour detection, connected components
- Histograms and histogram equalization
- Image transformations: affine, perspective, geometric

**What You'll Build:**
- Build an image processing pipeline with OpenCV
- Implement edge detection and contour-based object counting

---

### Week 2: Feature Engineering & Classical Methods

**Topics:**
- Feature descriptors (mathematical descriptions of interesting patterns in an image): HOG (Histogram of Oriented Gradients), SIFT, SURF, ORB
- Feature matching: brute force, FLANN, RANSAC for outlier rejection
- Template matching: finding known patterns in images
- Classical classification: SVM + HOG, Bag of Visual Words
- Optical flow (tracking how things move between video frames): Lucas-Kanade, Farneback
- Camera geometry basics: pinhole model, intrinsics, extrinsics, distortion
- When classical methods still win: low-compute environments, well-defined problems, interpretability

**What You'll Build:**
- Build a feature-based image matching system
- Implement a classical object tracker using optical flow

---

### Week 3: Image Classification with Deep Learning

**Topics:**
- CNN architectures for classification (quick review from DL course):
  - ResNet, EfficientNet, ConvNeXt
  - Vision Transformers (ViT): patches as tokens
  - Swin Transformer: hierarchical shifted windows
- Transfer learning (reusing a model already trained on millions of images for your own task): using pre-trained ImageNet models for custom tasks
- Fine-tuning strategies: when to freeze layers, gradual unfreezing, learning rate differential
- Data augmentation deep dive:
  - Traditional: flip, rotate, crop, color jitter
  - Advanced: CutMix, MixUp, RandAugment, AugMax
  - Test-time augmentation (TTA): ensemble of augmented predictions
- Handling real-world challenges: class imbalance, noisy labels, domain shift
- Model evaluation: top-1 accuracy, top-5, precision/recall per class, confusion matrix

**What You'll Build:**
- Fine-tune a ViT model for a custom multi-class classification task
- Compare CNN vs ViT performance and analyze failure cases

---

### Week 4: Object Detection

**Topics:**
- The object detection task: classify + localize simultaneously
- Evaluation metrics: IoU (Intersection over Union — how much the predicted box overlaps with the real box), mAP (mean Average Precision), precision-recall curves
- Anchor-based detectors:
  - Two-stage: Faster R-CNN — region proposals + classification
  - One-stage: SSD, RetinaNet (focal loss for class imbalance)
- YOLO family deep dive:
  - Architecture evolution: YOLOv5 → YOLOv8 → YOLOv11/v12
  - Why YOLO dominates real-time detection
  - Ultralytics ecosystem: training, export, deployment
- Anchor-free detectors: FCOS, CenterNet — no predefined boxes
- Transformer-based detection: DETR (Detection Transformer), Grounding DINO
  - Grounding DINO: open-set detection with text prompts
- Dataset preparation: annotation formats (COCO, VOC, YOLO), annotation tools (Roboflow, CVAT, Label Studio)

**What You'll Build:**
- Train a YOLOv11 model on a custom dataset with Roboflow
- Compare YOLO vs DETR on detection quality and speed
- Experiment with Grounding DINO for zero-shot object detection

---

### Week 5: Image Segmentation

**Topics:**
- Segmentation types:
  - Semantic segmentation (coloring every pixel with a label): classify every pixel (road, building, sky)
  - Instance segmentation (telling apart individual objects of the same type): separate individual objects (car 1, car 2, car 3)
  - Panoptic segmentation (the complete picture): combining semantic + instance
- Architecture evolution:
  - FCN (Fully Convolutional Network): the foundation
  - U-Net: encoder-decoder with skip connections (dominant in medical imaging)
  - DeepLab v3+: atrous convolutions, ASPP
  - Mask R-CNN: extending Faster R-CNN for instance segmentation
- SAM (Segment Anything Model) — the foundation model revolution:
  - SAM architecture: ViT encoder + prompt encoder + mask decoder
  - Prompt types: points, boxes, text, masks
  - SAM 2: video segmentation, temporal consistency
  - SAM 3: zero-shot transfer, edge deployment, 3.03s average latency
  - SAM + CLIP: combining segmentation with semantic understanding
- Evaluation metrics: mIoU (mean Intersection over Union), pixel accuracy, Dice coefficient

**What You'll Build:**
- Train a U-Net for medical image segmentation
- Use SAM for interactive segmentation with different prompt types
- Build a pipeline combining SAM + CLIP for text-prompted segmentation

---

### Week 6: Face & Human Analysis

**Topics:**
- Face detection: MTCNN, RetinaFace, BlazeFace
- Face recognition: ArcFace, FaceNet — embedding-based approaches (turning faces into numbers for comparison)
- Facial landmark detection: 68-point, 3D face mesh
- Face verification vs identification: one-to-one vs one-to-many
- Human pose estimation: OpenPose, MediaPipe, HRNet
- Human action recognition: video-based activity understanding
- Liveness detection: preventing face spoofing attacks
- Privacy and ethical considerations:
  - Bias in face recognition: racial, gender, age disparities
  - Deepfake detection: identifying AI-generated faces
  - Regulatory landscape: GDPR facial data, EU AI Act prohibitions on mass surveillance
  - When NOT to use face recognition: ethical red lines

**What You'll Build:**
- Build a face verification system with anti-spoofing
- Implement human pose estimation for an activity recognition task
- Audit a face recognition model for demographic bias

---

### Week 7: Midterm Exam

Covers Weeks 1-6: classical CV, classification, detection, segmentation, SAM, face analysis.

---

### Week 8: Video Understanding

**Topics:**
- Video as a data structure: frames, temporal dimension, optical flow
- Video classification:
  - 2D CNN + temporal aggregation
  - 3D CNNs: C3D, I3D — spatiotemporal convolutions
  - Video Transformers: TimeSformer, Video Swin Transformer
- Object tracking:
  - Single object tracking: SiamFC, SiamRPN++
  - Multi-object tracking (MOT): SORT, DeepSORT, ByteTrack, BoT-SORT
  - Tracking + detection: the tracking-by-detection paradigm
- Action recognition and temporal understanding
- Video segmentation: SAM 2 for video — temporal consistency across frames
- Practical challenges: frame rate, resolution, storage, real-time processing

**What You'll Build:**
- Build a multi-object tracking system with YOLOv11 + ByteTrack
- Implement video classification for action recognition

---

### Week 9: 3D Vision & Depth

**Topics:**
- Depth estimation (figuring out how far away things are in an image):
  - Monocular depth estimation: MiDaS, DPT — depth from a single image
  - Stereo vision: disparity maps, depth from two cameras
  - Structured light and LiDAR: active depth sensing
- Point clouds: 3D data representation
  - PointNet, PointNet++: deep learning on point clouds
  - 3D object detection: VoxelNet, PointPillars
- 3D reconstruction:
  - Structure from Motion (SfM): 3D from multiple 2D images
  - Neural Radiance Fields (NeRF — creating 3D scenes from a set of 2D photos): novel view synthesis
  - 3D Gaussian Splatting (a faster way to recreate 3D scenes): faster alternative to NeRF (2024+)
- Applications: autonomous driving, robotics, AR/VR, digital twins

**What You'll Build:**
- Build a monocular depth estimation system using MiDaS
- Experiment with 3D Gaussian Splatting for scene reconstruction

---

### Week 10: OCR & Document Understanding

**Topics:**
- Text detection: EAST, DBNet — finding text in images
- Text recognition: CRNN, TrOCR — reading detected text
- End-to-end OCR: PaddleOCR, EasyOCR, Tesseract
- Document understanding:
  - Layout analysis: detecting paragraphs, tables, figures, headers
  - Table extraction: structured data from document images
  - LayoutLM: multimodal document understanding (text + layout + image)
- Document intelligence with Vision-Language Models:
  - GPT-4V, Claude Vision, Gemini for document parsing
  - Invoice processing, receipt extraction, form filling
- Handwriting recognition and historical document digitization
- Practical considerations: preprocessing, deskewing, noise removal

**What You'll Build:**
- Build a document processing pipeline: detect text → recognize → extract structured data
- Create an invoice processing system using OCR + VLM

---

### Week 11: Foundation Models for Vision

**Topics:**
- The foundation model paradigm: pre-train once, adapt everywhere
- CLIP (Contrastive Language-Image Pretraining):
  - Architecture: separate vision and text encoders aligned in shared space
  - Zero-shot classification: classify images with text descriptions
  - CLIP as a feature extractor for downstream tasks
- DINO and DINOv2: self-supervised visual features without labels
- Grounding DINO: open-set object detection with language
- Florence (Microsoft): unified vision-language model
- RAM (Recognize Anything Model): universal image tagging
- Open-vocabulary detection and segmentation: detecting things you never trained on
- The trend: combining foundation models (SAM + CLIP, Grounding DINO + SAM) for powerful pipelines

**What You'll Build:**
- Build a zero-shot visual search system using CLIP
- Create a pipeline: text query → Grounding DINO detection → SAM segmentation
- Compare supervised vs foundation model approaches on the same task

---

### Week 12: Generative Vision

**Topics:**
- Image generation evolution: from GANs to Diffusion Models
- Text-to-image generation:
  - Stable Diffusion: latent diffusion with text conditioning
  - DALL-E 3: creative image generation
  - Flux: next-generation architecture
- Image editing with AI:
  - Inpainting (filling in removed or missing parts of an image)
  - Outpainting (extending an image beyond its original borders)
  - Style transfer (making a photo look like a painting by a famous artist)
  - Image-to-image translation: ControlNet, IP-Adapter
- Video generation: Sora, Runway, Kling — generating video from text
- Practical applications: content creation, design prototyping, data augmentation
- Deepfake detection: identifying AI-generated visual content
- Ethical considerations: copyright, consent, misinformation

**What You'll Build:**
- Generate images with Stable Diffusion and experiment with different prompts/guidance scales
- Use ControlNet for controlled image generation (pose-guided, edge-guided)
- Build a simple deepfake detection system

---

### Week 13: Edge Deployment & Real-Time Vision

**Topics:**
- Why edge matters: latency, privacy, cost, offline capability
- Model optimization for edge:
  - Quantization (shrinking model size by using less precise numbers): post-training quantization (PTQ), quantization-aware training (QAT)
  - Pruning (removing unnecessary connections to make models smaller)
  - Knowledge distillation (training a small "student" model to mimic a large "teacher" model)
  - Neural Architecture Search (NAS — letting the computer design the best model structure automatically)
- Edge deployment platforms:
  - NVIDIA Jetson: GPU-powered edge AI
  - Intel OpenVINO: optimized inference for Intel hardware
  - Apple Core ML: iOS/macOS deployment
  - TensorFlow Lite: Android and embedded devices
  - ONNX Runtime: cross-platform deployment
- Real-time processing: batching, async inference, frame skipping strategies
- Edge-cloud hybrid: running lightweight models on edge, heavy models in cloud
- Industrial applications: quality inspection, autonomous vehicles, surveillance, retail analytics

**What You'll Build:**
- Optimize a model for edge deployment with quantization + pruning
- Deploy a real-time object detection system on a resource-constrained device
- Build an edge-cloud hybrid pipeline: fast detection on edge, detailed analysis in cloud

---

### Week 14: Capstone — End-to-End Computer Vision System

**Topics:**
- System design for computer vision applications
- Data pipeline: collection, annotation, augmentation, versioning
- Model selection and training strategy
- Deployment architecture: API, edge, batch processing
- Monitoring: drift detection, performance degradation, feedback loops
- MLOps for computer vision: CI/CD for model updates

**What You'll Build:**
- Design and build a complete computer vision system for a real-world problem
- Full pipeline: data → train → evaluate → optimize → deploy → monitor

---

### Week 15: Capstone Demo

Students present their end-to-end computer vision system. Peer review and instructor feedback.

---

### Week 16: Final Exam

Comprehensive exam covering all course material.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Apply classical image processing techniques and know when they outperform deep learning
2. Train and deploy object detection (YOLO, DETR), segmentation (U-Net, SAM), and classification models
3. Work with vision foundation models: CLIP, SAM, Grounding DINO, DINOv2
4. Build video understanding systems: tracking, action recognition, temporal segmentation
5. Implement 3D vision tasks: depth estimation, point clouds, NeRF/Gaussian Splatting
6. Build OCR and document processing systems using classical and VLM approaches
7. Generate and edit images with diffusion models (Stable Diffusion, ControlNet)
8. Optimize and deploy models for edge devices with quantization, pruning, and distillation
9. Design end-to-end computer vision systems from data collection to production monitoring
10. Navigate ethical considerations: bias in visual AI, deepfake detection, privacy regulations
