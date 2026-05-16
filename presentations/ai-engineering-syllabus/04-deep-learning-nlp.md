---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Deep Learning & NLP

**Master neural architectures from CNNs to Diffusion Models, with deep focus on language understanding**

- Audience: Students who completed Machine Learning (neural networks, backprop, PyTorch)
- Go deep into the architectures that power modern AI
- Build CNNs, Transformers, GANs, and Diffusion Models

---

# Course Overview

- How does AI turn a photo into a description? How does Google Translate work?
- You'll go deep into the neural network architectures that power modern AI
- Build CNNs that understand images, Transformers that understand language
- Build generative models that create entirely new content
- You know the basics from ML -- now see what these systems can really do

---

# Prerequisites & Self-Check

**Prerequisites:** Machine Learning (neural networks, backpropagation, PyTorch basics)

**Can you:**
- [ ] Explain what a neural network does in one sentence?
- [ ] Write a simple PyTorch model and train it?
- [ ] Understand what "training loss going down" means?
- [ ] Use Google Colab or a local setup with GPU?
- [ ] Describe the difference between classification and regression?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **Core:** PyTorch, Hugging Face Transformers
- **Vision:** torchvision
- **Audio:** torchaudio
- **Tracking:** TensorBoard, Weights & Biases
- **Deployment:** ONNX
- **Compute:** CUDA basics

---

# Week 0: Neural Network Prerequisites

*Bridges the gap from the ML course and gets you comfortable with semester tools.*

- Quick review: what is ML? (recap from Course 02)
- PyTorch refresher: tensors (multi-dimensional arrays), autograd (automatic gradients), training loop
- GPU basics: why GPUs matter for deep learning, Google Colab setup
- Linear algebra refresher: matrix multiplication, dot product -- visual intuition

**What You'll Build:**
- Set up Google Colab with GPU and verify it works
- Build and train a tiny neural network in PyTorch step by step

---

# Week 1: Deep Learning Foundations Review

*Before complex models, we need solid foundations.*

- Review: neural networks, backpropagation, activation functions, optimizers
- Computational graphs and autograd in depth
- Advanced optimization: AdamW, LAMB, cosine annealing, warmup
- Normalization: Batch Norm, Layer Norm, Group Norm, RMSNorm
- Mixed precision training: FP16/BF16 (lower-precision numbers for faster training)

**What You'll Build:**
- Train a model with mixed precision and observe speedup
- Profile GPU memory usage and optimize a training loop

---

# Week 2: CNN Architecture Deep Dive

- Convolution operation (sliding a filter across an image to detect features): filters, stride, padding
- Classic architectures: LeNet, AlexNet, VGGNet
- ResNet: skip connections (shortcuts that let information bypass layers)
- Inception: multi-scale feature extraction
- EfficientNet: compound scaling (depth x width x resolution)
- Modern: ConvNeXt -- CNNs that compete with Transformers (2022+)

**What You'll Build:**
- Implement ResNet from scratch in PyTorch
- Train on CIFAR-100 and visualize learned features at different layers

---

# Week 3: CNN Applications -- Detection & Segmentation

*Knowing WHERE the dog is in the image powers self-driving cars and medical imaging.*

- Object detection evolution: R-CNN family (two-stage), YOLO (one-stage, real-time)
- Anchor-free detectors: FCOS, CenterNet
- Semantic segmentation: U-Net, DeepLab
- Instance segmentation: Mask R-CNN
- Data augmentation: traditional (flip, rotate) + modern (CutMix, MixUp, RandAugment)

**What You'll Build:**
- Fine-tune a YOLO model for custom object detection
- Build a semantic segmentation model for a real-world use case

---

# Week 4: Sequence Models & Attention

- Why sequences matter: text, audio, time series, video
- RNN deep dive: hidden states ("memory"), BPTT (learning from sequences backwards)
- LSTM: forget gate, input gate, output gate -- controlling what to keep and discard
- GRU (Gated Recurrent Unit -- simpler version of LSTM)
- Sequence-to-sequence: encoder-decoder for translation, summarization
- The attention mechanism: the bridge from RNN to Transformers

**What You'll Build:**
- Build a seq2seq model with attention for machine translation
- Compare RNN vs LSTM vs GRU on a sequence prediction task

---

# Week 5: Transformers -- The Architecture That Changed Everything

*THE architecture behind ChatGPT, BERT, Stable Diffusion, and most of modern AI.*

- "Attention Is All You Need" (2017): a deep reading
- Self-attention: Query, Key, Value in mathematical detail
- Positional encoding: sinusoidal, learned, RoPE, ALiBi
- The full Transformer block: attention, Add & Norm, FFN
- Efficient attention: Flash Attention, multi-query, grouped-query attention

**What You'll Build:**
- Implement a Transformer from scratch in PyTorch
- Train it on a small language modeling task

---

# Week 6: The Transformer Family -- BERT, GPT & Beyond

- **Encoder models (BERT family):** Masked Language Modeling, RoBERTa, DeBERTa
- **Decoder models (GPT family):** Causal language modeling, scaling journey GPT-1 to GPT-4
- Emergent abilities: in-context learning (learning from prompt examples), chain-of-thought
- **Encoder-Decoder:** T5 ("everything is text generation"), BART
- Model selection: which architecture for which task?

**What You'll Build:**
- Fine-tune BERT for text classification using Hugging Face
- Fine-tune T5 for summarization, compare encoder vs decoder on the same task

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- Deep learning foundations
- CNNs (architecture and applications)
- Sequence models and attention
- Transformers
- BERT/GPT family

---

# Week 8: Transfer Learning & Hugging Face Ecosystem

*You don't need to train from scratch. Transfer learning + Hugging Face makes it easy.*

- Transfer learning: why pre-training + fine-tuning works so well
- Hugging Face: Model Hub, Datasets library, Tokenizers, Trainer API, Pipeline API
- Fine-tuning strategies: full, feature extraction, gradual unfreezing
- Parameter-efficient fine-tuning: LoRA, QLoRA, adapters, prefix tuning
- Evaluation: GLUE, SuperGLUE, MMLU benchmarks

**What You'll Build:**
- Fine-tune a model for domain-specific NLP using LoRA
- Build a complete NLP pipeline: data, tokenize, train, evaluate, serve

---

# Week 9: NLP Applications -- Text Understanding & Generation

*Sentiment analysis, translation, chatbots, document search -- tasks companies hire NLP engineers for.*

- Text classification: sentiment, topic, intent detection
- NER (Named Entity Recognition -- finding names, places, dates in text)
- Question Answering: extractive vs abstractive
- Summarization, machine translation
- Semantic similarity: sentence embeddings, bi-encoders vs cross-encoders
- Multilingual NLP: mBERT, XLM-R, cross-lingual transfer

**What You'll Build:**
- Build a domain-specific NER system (legal, medical, or financial)
- Create a multilingual text classification system

---

# Week 10: Speech & Audio Deep Learning

*Voice assistants, subtitle generation, audiobook narration -- all rely on deep learning for audio.*

- Audio fundamentals: waveforms, spectrograms (visual pictures of sound), mel-spectrograms
- Speech recognition (ASR): Whisper (OpenAI), Wav2Vec 2.0
- Text-to-Speech: Tacotron, VITS, Bark, voice cloning
- Audio classification: environmental sounds, music genre, emotion detection
- Speaker identification and verification

**What You'll Build:**
- Build a speech-to-text system using Whisper
- Create an audio classification model for a practical use case

---

# Week 11: Generative Models -- GANs & VAEs

- Generative vs discriminative: modeling P(X) vs P(Y|X)
- VAEs: encoder-decoder with probabilistic latent space, reparameterization trick
- GANs (two networks competing: one creates fakes, one catches them)
- GAN architectures: DCGAN, StyleGAN, CycleGAN, Pix2Pix
- Training challenges: mode collapse, training instability
- Comparing generative approaches: VAEs vs GANs vs Diffusion Models

**What You'll Build:**
- Train a VAE on image data and explore the latent space
- Train a GAN for image generation with latent space interpolation

---

# Week 12: Diffusion Models -- The New Standard for Generation

*Behind Stable Diffusion, DALL-E, and Sora. The dominant approach for generating images and video.*

- What are diffusion models: adding noise, then learning to remove it
- Forward process (adding noise) and reverse process (denoising)
- Key architectures: DDPM, Latent Diffusion (Stable Diffusion), DiT (Diffusion Transformers)
- Conditioning: text-to-image (CLIP guidance), image-to-image, inpainting
- Acceleration: DDIM, DPM-Solver -- fewer steps, faster generation

**What You'll Build:**
- Implement a simple DDPM from scratch
- Fine-tune Stable Diffusion with DreamBooth or textual inversion

---

# Week 13: Vision Transformers & Multimodal Models

- Vision Transformers (ViT): treating images as sequences of patches
- DeiT, Swin Transformer: data-efficient and hierarchical variants
- Self-supervised visual learning: DINO, MAE (Masked Autoencoders)
- CLIP: aligning vision and language in shared embedding space
- Vision-Language Models: GPT-4V, Claude Vision, Gemini
- SAM (Segment Anything Model): foundation model for segmentation

**What You'll Build:**
- Fine-tune a Vision Transformer for image classification
- Use CLIP for zero-shot classification and image-text retrieval

---

# Week 14: Model Optimization & Deployment

*A model that only runs on an expensive server isn't very useful.*

- Quantization (less-precise numbers): FP32 to FP16 to INT8 to INT4
- Pruning (removing unnecessary connections) and knowledge distillation
- Model export: ONNX for cross-platform deployment
- Serving: TorchServe, NVIDIA Triton, vLLM
- Distributed training: data parallelism, model parallelism, PyTorch FSDP, DeepSpeed

**What You'll Build:**
- Quantize a model and measure quality/speed tradeoff
- Deploy with ONNX Runtime for cross-platform inference

---

# Week 15: Capstone Demo

- Students present a deep learning project demonstrating mastery
- **Requirements:**
  - Novel architecture application
  - Rigorous evaluation with baseline comparisons
  - Options: NLP, computer vision, generative, multimodal, or audio
- Peer review and instructor feedback

---

# Week 16: Final Exam

- Comprehensive exam covering all material:
  - CNNs and Transformers
  - NLP and speech/audio
  - GANs and diffusion models
  - Vision Transformers and multimodal models
  - Model optimization and deployment

---

# Recommended Resources

- **Deep Learning** -- Ian Goodfellow, Yoshua Bengio, Aaron Courville
- **Natural Language Processing with Transformers** -- Lewis Tunstall et al.
- **Dive into Deep Learning** -- Aston Zhang et al. (d2l.ai)
- **Speech and Language Processing** -- Dan Jurafsky & James Martin
- **Hugging Face Course** -- huggingface.co/course
