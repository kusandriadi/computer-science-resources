# Deep Learning & NLP

**Master neural architectures from CNNs to Diffusion Models, with deep focus on language understanding**

---

## Course Overview

How does an AI turn a photo into a description? How does Google Translate work? How are AI-generated images made? The answer to all of these is deep learning.

In this course, you'll go deep into the neural network architectures that power modern AI. You'll build CNNs that understand images, Transformers that understand language, and generative models that create entirely new content. You already know the basics from Machine Learning. Now it's time to see what these systems can really do.

---

## Prerequisites

- Machine Learning (Semester 2) — neural networks, backpropagation, PyTorch basics
- Generative AI Engineering (Semester 3) recommended but not required

### Self-Check: Am I Ready?

Before starting this course, make sure you can:
- [ ] Explain what a neural network does in one sentence (e.g., "it learns patterns from data to make predictions")
- [ ] Write a simple PyTorch model with at least one layer and train it on sample data
- [ ] Understand what "training loss going down" means (the model is getting better)
- [ ] Use Google Colab or a local setup with GPU access
- [ ] Describe the difference between classification (categories) and regression (numbers)

If you can't check all boxes, don't worry! Week 0 covers these foundations.

## Tools & Technologies

PyTorch, Hugging Face Transformers, torchvision, torchaudio, TensorBoard, Weights & Biases, ONNX, CUDA basics

---

## Weekly Schedule

---

### Week 0: Neural Network Prerequisites

*Welcome! This week bridges the gap from the ML course and makes sure you're comfortable with the tools we'll use all semester.*

**Topics:**
- Quick review: what is ML? (recap from Course 02 — how machines learn from data)
- PyTorch refresher: tensors (multi-dimensional arrays), autograd (automatic calculation of gradients), simple training loop
- GPU basics: why GPUs matter for deep learning, Google Colab setup for free GPU access
- Linear algebra refresher: matrix multiplication, dot product — with visual intuition, not just formulas

**What You'll Build:**
- Set up Google Colab with GPU and verify it works
- Build and train a tiny neural network in PyTorch (step by step, with comments explaining each line)
- Visualize matrix multiplication: see how numbers flow through a neural network layer

---

### Week 1: Deep Learning Foundations Review

*Why this matters: Before we build complex models, we need solid foundations. This week sharpens your tools and introduces techniques that make training faster and more reliable.*

**Topics:**
- Quick review: neural networks, backpropagation, activation functions, optimizers
- Computational graphs and automatic differentiation (autograd — letting PyTorch compute gradients for you) in depth
- Advanced optimization: AdamW, LAMB, learning rate schedulers (cosine annealing, warmup — ways to control how fast the model learns over time)
- Normalization techniques (keeping numbers in a stable range during training):
  - Batch Norm, Layer Norm, Group Norm, RMSNorm — when to use which
- Modern regularization (techniques to prevent the model from memorizing instead of learning):
  - Dropout, DropPath, stochastic depth, weight decay
- Mixed precision training: FP16/BF16 (using lower-precision numbers). This lets you train faster with less memory
- GPU programming basics: why GPUs matter, CUDA concepts, memory management

**What You'll Build:**
- Train a model with mixed precision and observe speedup
- Profile GPU memory usage and optimize a training loop

---

### Week 2: Convolutional Neural Networks (CNN) — Architecture Deep Dive

**Topics:**
- Convolution operation (sliding a small filter across an image to detect features like edges or textures): filters, stride, padding, receptive field
- Classic architectures and their innovations:
  - LeNet → AlexNet → VGGNet: the early evolution
  - ResNet: skip connections (shortcuts that let information bypass layers) that solved the vanishing gradient problem
  - Inception: multi-scale feature extraction
  - EfficientNet: compound scaling (depth × width × resolution)
- Modern CNNs: ConvNeXt — CNNs that compete with Transformers (2022+)
- Depthwise separable convolutions (a lighter, faster version of regular convolutions): MobileNet for efficient inference
- Feature visualization: what do CNNs actually "see"?

**What You'll Build:**
- Implement ResNet from scratch in PyTorch
- Train on CIFAR-100 and visualize learned features at different layers

---

### Week 3: CNN Applications — Detection & Segmentation

*Why this matters: Knowing that something is a "dog" (classification) is useful. But knowing *where* the dog is in the image, and separating it from the background? That's what powers self-driving cars, medical imaging, and so much more.*

**Topics:**
- Image classification: transfer learning with pre-trained models
- Object detection evolution:
  - Two-stage: R-CNN → Fast R-CNN → Faster R-CNN
  - One-stage: SSD → YOLO (v5 through v12) — real-time detection
  - Anchor-free detectors: FCOS, CenterNet
- Semantic segmentation: U-Net, DeepLab
- Instance segmentation: Mask R-CNN
- Data augmentation strategies:
  - Traditional: flip, rotate, crop
  - Modern: CutMix, MixUp, RandAugment
- Practical considerations: dataset preparation, annotation tools, imbalanced classes

**What You'll Build:**
- Fine-tune a YOLO model for custom object detection
- Build a semantic segmentation model for a real-world use case

---

### Week 4: Sequence Models & Attention

**Topics:**
- Why sequences matter: text, audio, time series, video are all sequential
- RNN deep dive: hidden states (the network's "memory"), BPTT (Backpropagation Through Time — learning from sequences by going backwards through each step)
- LSTM (Long Short-Term Memory): forget gate, input gate, output gate — controlling what information to keep and what to discard
- GRU (Gated Recurrent Unit — a simpler version of LSTM): simplified gating mechanism
- Bidirectional models: looking at past and future context
- Sequence-to-sequence: encoder-decoder architecture for translation, summarization
- The attention mechanism: Bahdanau attention, Luong attention
- Why attention matters: the bridge from RNN to Transformers

**What You'll Build:**
- Build a sequence-to-sequence model with attention for machine translation
- Compare RNN vs LSTM vs GRU on a sequence prediction task

---

### Week 5: Transformers — The Architecture That Changed Everything

*Why this matters: Transformers are THE architecture behind ChatGPT, BERT, Stable Diffusion, and most of modern AI. Understanding them is essential for everything that comes next in this course — and in your career.*

**Topics:**
- The "Attention Is All You Need" paper (2017): a deep reading
- Self-attention mechanics: Query, Key, Value in mathematical detail
- Multi-head attention: why multiple attention heads capture different relationships
- Positional encoding (telling the model the order of words, since Transformers don't naturally know position): sinusoidal, learned, RoPE (Rotary Position Embedding), ALiBi
- The full Transformer block: attention → Add & Norm → FFN → Add & Norm
- Encoder-only vs Decoder-only vs Encoder-Decoder architectures
- Computational complexity: O(n²) attention and efforts to reduce it
- Efficient attention variants (ways to make attention faster and use less memory): Flash Attention, multi-query attention, grouped-query attention
- Implementation details that matter: pre-norm vs post-norm, initialization

**What You'll Build:**
- Implement a Transformer from scratch in PyTorch (following the original paper)
- Train it on a small language modeling task

---

### Week 6: The Transformer Family — BERT, GPT & Beyond

**Topics:**
- Encoder models (BERT family):
  - BERT: Masked Language Modeling (predicting hidden words in a sentence) + Next Sentence Prediction
  - RoBERTa: training BERT better
  - DeBERTa: disentangled attention
  - Use cases: classification, NER, question answering, semantic similarity
- Decoder models (GPT family):
  - GPT, GPT-2, GPT-3 → GPT-4: the scaling journey
  - Causal language modeling: predicting the next token (word piece)
  - Emergent abilities with scale: in-context learning (learning from examples in the prompt), chain-of-thought (reasoning step by step)
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

*Why this matters: You don't need to train a model from scratch on millions of data points. Transfer learning lets you take a model someone else already trained and adapt it to your task. Hugging Face makes this surprisingly easy.*

**Topics:**
- Transfer learning (reusing a model trained on a large dataset for your specific task): why pre-training + fine-tuning works so well
- The Hugging Face ecosystem — your new best friend:
  - Model Hub: thousands of pre-trained models
  - Datasets library: standardized dataset loading
  - Tokenizers: fast, efficient tokenization
  - Trainer API: simplified fine-tuning
  - Pipeline API: zero-code inference
- Fine-tuning strategies: full fine-tuning, feature extraction, gradual unfreezing
- Parameter-efficient fine-tuning (adapting a model without retraining all its billions of parameters): LoRA, QLoRA, adapters, prefix tuning (practical deep dive)
- Evaluation: benchmarks (GLUE, SuperGLUE, MMLU), human evaluation, domain-specific metrics
- Self-supervised learning: how models learn from unlabeled data (contrastive learning, masked modeling)

**What You'll Build:**
- Fine-tune a model for a domain-specific NLP task using LoRA
- Build a complete NLP pipeline: data → tokenize → train → evaluate → serve

---

### Week 9: NLP Applications — Text Understanding & Generation

*Why this matters: This is where all the theory turns into real applications. Sentiment analysis, translation, chatbots, document search — these are the tasks companies hire NLP engineers for.*

**Topics:**
- Text classification: sentiment analysis, topic classification, intent detection
- Named Entity Recognition (NER — finding names, places, dates, and other key items in text): extracting structured information from text
- Question Answering: extractive (find the answer in the text) vs abstractive (generate the answer)
- Text summarization: extractive vs abstractive approaches
- Machine translation: modern approaches with Transformers
- Semantic similarity (measuring how close two texts are in meaning): sentence embeddings, contrastive learning, bi-encoders vs cross-encoders
- Information extraction: relation extraction, event extraction
- Multilingual NLP: cross-lingual transfer, multilingual models (mBERT, XLM-R)

**What You'll Build:**
- Build a complete NER system for a specific domain (legal, medical, or financial)
- Create a multilingual text classification system

---

### Week 10: Speech & Audio Deep Learning

*Why this matters: Voice assistants, subtitle generation, audiobook narration, music analysis — all of these rely on deep learning for audio. This week, you'll build systems that can hear and speak.*

**Topics:**
- Audio fundamentals: waveforms (the raw sound signal), spectrograms (visual pictures of sound showing frequency over time), mel-spectrograms, MFCCs
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
- Generative Adversarial Networks (GANs — two networks competing: one creates fakes, one tries to catch them):
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

*Why this matters: Diffusion models are behind Stable Diffusion, DALL-E, and Sora. They've become the dominant approach for generating images and video. Understanding them opens the door to the creative AI frontier.*

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

*Why this matters: A model that only runs on an expensive server isn't very useful. This week teaches you how to make models smaller, faster, and ready to run anywhere — including phones and edge devices.*

**Topics:**
- Model compression — three ways to make models smaller and faster:
  - Quantization (using less-precise numbers): FP32 → FP16 → INT8 → INT4. Tradeoffs between size, speed, and accuracy
  - Pruning (removing unnecessary connections to make models leaner)
  - Knowledge distillation (training a smaller "student" model to mimic a larger "teacher" model)
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

Comprehensive exam covering all course material. Topics include CNNs, Transformers, NLP, speech, GANs, diffusion models, Vision Transformers, multimodal models, and deployment.

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
