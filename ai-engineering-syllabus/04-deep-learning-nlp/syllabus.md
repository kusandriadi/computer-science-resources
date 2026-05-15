# Deep Learning & NLP

**Master neural architectures from CNNs to Diffusion Models, with deep focus on language understanding**

---

## Course Overview

This course provides a deep dive into neural network architectures beyond the introduction covered in Machine Learning. Students will master Convolutional Neural Networks for vision tasks, advanced sequence models, the full Transformer architecture family (BERT, GPT, T5), generative models (GANs, VAEs, Diffusion Models), and modern NLP techniques including transfer learning with Hugging Face. The course bridges classical deep learning with the generative AI era, giving students the theoretical depth to understand why architectures work and the practical skills to build state-of-the-art systems.

---

## Prerequisites

- Machine Learning (Semester 2) — neural networks, backpropagation, PyTorch basics
- Generative AI Engineering (Semester 3) recommended but not required

## Tools & Technologies

PyTorch, Hugging Face Transformers, torchvision, torchaudio, TensorBoard, Weights & Biases, ONNX, CUDA basics

---

## Weekly Schedule

---

### Week 1: Deep Learning Foundations Review

**Topics:**
- Quick review: neural networks, backpropagation, activation functions, optimizers
- Computational graphs and automatic differentiation (autograd) in depth
- Advanced optimization: AdamW, LAMB, learning rate schedulers (cosine annealing, warmup)
- Normalization techniques: Batch Norm, Layer Norm, Group Norm, RMSNorm — when to use which
- Modern regularization: dropout, DropPath, stochastic depth, weight decay
- Mixed precision training: FP16/BF16 — training faster with less memory
- GPU programming basics: why GPUs matter, CUDA concepts, memory management

**What You'll Build:**
- Train a model with mixed precision and observe speedup
- Profile GPU memory usage and optimize a training loop

---

### Week 2: Convolutional Neural Networks (CNN) — Architecture Deep Dive

**Topics:**
- Convolution operation: filters, stride, padding, receptive field
- Classic architectures and their innovations:
  - LeNet → AlexNet → VGGNet: the early evolution
  - ResNet: skip connections that solved the vanishing gradient problem
  - Inception: multi-scale feature extraction
  - EfficientNet: compound scaling (depth × width × resolution)
- Modern CNNs: ConvNeXt — CNNs that compete with Transformers (2022+)
- Depthwise separable convolutions: MobileNet for efficient inference
- Feature visualization: what do CNNs actually "see"?

**What You'll Build:**
- Implement ResNet from scratch in PyTorch
- Train on CIFAR-100 and visualize learned features at different layers

---

### Week 3: CNN Applications — Detection & Segmentation

**Topics:**
- Image classification: transfer learning with pre-trained models
- Object detection evolution:
  - Two-stage: R-CNN → Fast R-CNN → Faster R-CNN
  - One-stage: SSD → YOLO (v5 through v12) — real-time detection
  - Anchor-free detectors: FCOS, CenterNet
- Semantic segmentation: U-Net, DeepLab
- Instance segmentation: Mask R-CNN
- Data augmentation strategies: traditional (flip, rotate, crop) and modern (CutMix, MixUp, RandAugment)
- Practical considerations: dataset preparation, annotation tools, imbalanced classes

**What You'll Build:**
- Fine-tune a YOLO model for custom object detection
- Build a semantic segmentation model for a real-world use case

---

### Week 4: Sequence Models & Attention

**Topics:**
- Why sequences matter: text, audio, time series, video are all sequential
- RNN deep dive: hidden states, BPTT (Backpropagation Through Time)
- LSTM: forget gate, input gate, output gate — controlling information flow
- GRU: simplified gating mechanism
- Bidirectional models: looking at past and future context
- Sequence-to-sequence: encoder-decoder architecture for translation, summarization
- The attention mechanism: Bahdanau attention, Luong attention
- Why attention matters: the bridge from RNN to Transformers

**What You'll Build:**
- Build a sequence-to-sequence model with attention for machine translation
- Compare RNN vs LSTM vs GRU on a sequence prediction task

---

### Week 5: Transformers — The Architecture That Changed Everything

**Topics:**
- The "Attention Is All You Need" paper (2017): a deep reading
- Self-attention mechanics: Query, Key, Value in mathematical detail
- Multi-head attention: why multiple attention heads capture different relationships
- Positional encoding: sinusoidal, learned, RoPE (Rotary Position Embedding), ALiBi
- The full Transformer block: attention → Add & Norm → FFN → Add & Norm
- Encoder-only vs Decoder-only vs Encoder-Decoder architectures
- Computational complexity: O(n²) attention and efforts to reduce it
- Efficient attention variants: Flash Attention, multi-query attention, grouped-query attention
- Implementation details that matter: pre-norm vs post-norm, initialization

**What You'll Build:**
- Implement a Transformer from scratch in PyTorch (following the original paper)
- Train it on a small language modeling task

---

### Week 6: The Transformer Family — BERT, GPT & Beyond

**Topics:**
- Encoder models (BERT family):
  - BERT: Masked Language Modeling + Next Sentence Prediction
  - RoBERTa: training BERT better
  - DeBERTa: disentangled attention
  - Use cases: classification, NER, question answering, semantic similarity
- Decoder models (GPT family):
  - GPT, GPT-2, GPT-3 → GPT-4: the scaling journey
  - Causal language modeling: predicting the next token
  - Emergent abilities with scale: in-context learning, chain-of-thought
- Encoder-Decoder models:
  - T5: "Text-to-Text Transfer Transformer" — everything is a text generation problem
  - BART: denoising autoencoder for generation
- Model selection: which architecture for which task?

**What You'll Build:**
- Fine-tune BERT for text classification using Hugging Face
- Fine-tune a T5 model for summarization
- Compare encoder vs decoder models on the same task

---

### Week 7: Midterm Exam

Covers Weeks 1-6: deep learning foundations, CNNs, sequence models, Transformers, and the BERT/GPT family.

---

### Week 8: Transfer Learning & the Hugging Face Ecosystem

**Topics:**
- Transfer learning: why pre-training + fine-tuning works so well
- The Hugging Face ecosystem:
  - Model Hub: thousands of pre-trained models
  - Datasets library: standardized dataset loading
  - Tokenizers: fast, efficient tokenization
  - Trainer API: simplified fine-tuning
  - Pipeline API: zero-code inference
- Fine-tuning strategies: full fine-tuning, feature extraction, gradual unfreezing
- Parameter-efficient fine-tuning: LoRA, QLoRA, adapters, prefix tuning (practical deep dive)
- Evaluation: benchmarks (GLUE, SuperGLUE, MMLU), human evaluation, domain-specific metrics
- Self-supervised learning: how models learn from unlabeled data (contrastive learning, masked modeling)

**What You'll Build:**
- Fine-tune a model for a domain-specific NLP task using LoRA
- Build a complete NLP pipeline: data → tokenize → train → evaluate → serve

---

### Week 9: NLP Applications — Text Understanding & Generation

**Topics:**
- Text classification: sentiment analysis, topic classification, intent detection
- Named Entity Recognition (NER): extracting structured information from text
- Question Answering: extractive (find the answer in the text) vs abstractive (generate the answer)
- Text summarization: extractive vs abstractive approaches
- Machine translation: modern approaches with Transformers
- Semantic similarity: sentence embeddings, contrastive learning, bi-encoders vs cross-encoders
- Information extraction: relation extraction, event extraction
- Multilingual NLP: cross-lingual transfer, multilingual models (mBERT, XLM-R)

**What You'll Build:**
- Build a complete NER system for a specific domain (legal, medical, or financial)
- Create a multilingual text classification system

---

### Week 10: Speech & Audio Deep Learning

**Topics:**
- Audio fundamentals: waveforms, spectrograms, mel-spectrograms, MFCCs
- Speech recognition (ASR): from CTC to attention-based models
  - Whisper (OpenAI): universal speech recognition
  - Wav2Vec 2.0: self-supervised speech representations
- Text-to-Speech (TTS): modern neural TTS systems
  - Tacotron, VITS, Bark: generating natural-sounding speech
  - Voice cloning: few-shot voice synthesis
- Audio classification: environmental sounds, music genre, emotion detection
- Speaker identification and verification
- Practical considerations: data collection, noise handling, real-time processing

**What You'll Build:**
- Build a speech-to-text system using Whisper
- Create an audio classification model for a practical use case

---

### Week 11: Generative Models — GANs & VAEs

**Topics:**
- Generative vs discriminative models: modeling P(X) vs P(Y|X)
- Variational Autoencoders (VAEs):
  - Encoder-decoder with a probabilistic latent space
  - The reparameterization trick
  - KL divergence and the ELBO objective
  - Applications: image generation, anomaly detection, data augmentation
- Generative Adversarial Networks (GANs):
  - Generator vs discriminator: the adversarial game
  - Training challenges: mode collapse, training instability
  - Key architectures: DCGAN, StyleGAN, CycleGAN, Pix2Pix
  - Applications: image synthesis, style transfer, super-resolution, data augmentation
- Comparing generative approaches: VAEs vs GANs vs Diffusion Models

**What You'll Build:**
- Train a VAE on image data and explore the latent space
- Train a GAN for image generation and experiment with latent space interpolation

---

### Week 12: Diffusion Models — The New Standard for Generation

**Topics:**
- What are diffusion models: adding noise, then learning to remove it
- The forward process: gradually adding Gaussian noise until data becomes pure noise
- The reverse process: learning to denoise step by step
- Mathematical foundation: noise schedules, denoising score matching
- Key architectures:
  - DDPM (Denoising Diffusion Probabilistic Models): the foundation
  - Latent Diffusion Models: working in compressed latent space (Stable Diffusion)
  - Diffusion Transformers (DiT): replacing U-Net with Transformers for better quality
- Conditioning: text-to-image (CLIP guidance, classifier-free guidance), image-to-image, inpainting
- Acceleration techniques: DDIM, DPM-Solver — fewer steps, faster generation
- State of the art: Stable Diffusion 3, DALL-E 3, Midjourney, Flux, Sora (video)
- The convergence: Transformers + Diffusion = the future of generation

**What You'll Build:**
- Implement a simple DDPM from scratch
- Fine-tune a Stable Diffusion model with custom data using DreamBooth or textual inversion
- Generate images with different conditioning approaches

---

### Week 13: Vision Transformers & Multimodal Models

**Topics:**
- Vision Transformers (ViT): treating images as sequences of patches
  - ViT architecture: patch embedding, position embedding, classification token
  - DeiT: data-efficient training of Vision Transformers
  - Swin Transformer: hierarchical vision with shifted windows
- Self-supervised visual learning:
  - DINO: self-distillation with no labels
  - MAE (Masked Autoencoders): masked image modeling
- Multimodal models:
  - CLIP: aligning vision and language in shared embedding space
  - Vision-Language Models: GPT-4V, Claude Vision, Gemini — how they work
  - SAM (Segment Anything Model): foundation model for segmentation
  - SAM-CLIP: merging foundation models for combined capabilities
- The trend: foundation models + zero-shot transfer across vision tasks

**What You'll Build:**
- Fine-tune a Vision Transformer for image classification
- Use CLIP for zero-shot image classification and image-text retrieval
- Experiment with SAM for interactive segmentation

---

### Week 14: Model Optimization & Deployment

**Topics:**
- Model compression:
  - Quantization: FP32 → FP16 → INT8 → INT4 — tradeoffs between size, speed, and accuracy
  - Pruning: removing unnecessary weights and connections
  - Knowledge distillation: training a smaller model to mimic a larger one
- Model export: ONNX format for cross-platform deployment
- Serving frameworks: TorchServe, NVIDIA Triton Inference Server, vLLM
- Edge deployment: running models on mobile and embedded devices
  - Apple Core ML, TensorFlow Lite, ONNX Runtime Mobile
- Distributed training:
  - Data parallelism: same model, different data across GPUs
  - Model parallelism: splitting a model across GPUs
  - Pipeline parallelism: splitting layers across GPUs
  - Frameworks: PyTorch FSDP, DeepSpeed, Horovod
- Experiment tracking and reproducibility: Weights & Biases, MLflow

**What You'll Build:**
- Quantize a model and measure the quality/speed tradeoff
- Deploy a model with ONNX Runtime for cross-platform inference
- Set up distributed training across multiple GPUs

---

### Week 15: Capstone Demo

**Format:**
- Students present a deep learning project demonstrating mastery of advanced architectures
- Requirements: novel architecture application, rigorous evaluation, comparison with baselines
- Options: NLP task, computer vision task, generative model, multimodal application, or speech/audio task
- Peer review and instructor feedback

---

### Week 16: Final Exam

Comprehensive exam covering all course material: CNNs, Transformers, NLP, speech, GANs, diffusion models, Vision Transformers, multimodal models, and deployment.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Design and train CNNs for classification, detection, and segmentation tasks
2. Understand and implement the Transformer architecture from scratch
3. Fine-tune pre-trained models (BERT, GPT, T5, ViT) for domain-specific tasks using Hugging Face
4. Build NLP systems for classification, NER, question answering, summarization, and translation
5. Work with speech/audio models: speech recognition (Whisper), TTS, audio classification
6. Train and evaluate generative models: GANs, VAEs, and Diffusion Models
7. Understand modern foundation models: Vision Transformers, CLIP, SAM, and multimodal systems
8. Optimize models for deployment: quantization, pruning, ONNX export, edge deployment
9. Apply distributed training techniques for large-scale model training
10. Evaluate model performance rigorously with appropriate benchmarks and metrics
