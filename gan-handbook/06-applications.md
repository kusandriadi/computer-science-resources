# Module 6 — Applications

In 2026, the most useful GANs are not the headline-grabbing face generators — they are tools that quietly do one specific job extremely well. This module covers super-resolution (with **Real-ESRGAN as the centerpiece**), inpainting, GAN inversion and editing, and deepfakes.

## Learning goals

By the end of this module you can:

- Explain why super-resolution is a GAN's natural strength.
- Walk through the architecture and tricks behind SRGAN, ESRGAN, and Real-ESRGAN.
- Use Real-ESRGAN on your own photos.
- Explain GAN inversion and how StyleGAN editing works.

## 6.1 Super-resolution — the GAN's quiet success

**The task.** Given a low-resolution image, produce a high-resolution one. Classic example: take a 256×256 photo and output a sharp 1024×1024 version.

Pixel-level losses (L1, L2) cannot solve this well. To upscale a 256×256 cat photo to 1024×1024, the network has to *invent* 15 new pixels for every one input pixel. There are many plausible high-res versions of the same low-res input. Averaging them all (which is what L2 implicitly does) produces a blurry, smeared image.

GANs are perfect for this. Instead of averaging, the discriminator says "this looks real" or "this looks fake" — and the generator learns to produce *one specific* plausible high-res version, sharp and detailed.

The lineage: **SRGAN → ESRGAN → Real-ESRGAN.**

### 6.1.1 SRGAN (2017)

Ledig et al., the first super-resolution GAN. The architecture:

- **Generator:** a deep residual network (16 residual blocks) followed by two pixel-shuffle upsampling layers. Input 64×64, output 256×256 (4× upscaling).
- **Discriminator:** standard convolutional classifier.
- **Loss:** adversarial loss + **perceptual loss** (also called VGG loss).

**Perceptual loss.** Instead of comparing pixels, compare *features* from a pretrained VGG network:

$$L_{\text{perc}} = \|\phi(I_{\text{HR}}) - \phi(G(I_{\text{LR}}))\|_2^2$$

**Notation.**

| Symbol | Read it as | What it means |
|---|---|---|
| $L_{\text{perc}}$ | "L sub perc" or "perceptual loss" | The perceptual loss we are minimizing. |
| $I_{\text{HR}}$ | "I sub HR" | Ground-truth high-resolution image. (HR = high resolution.) |
| $I_{\text{LR}}$ | "I sub LR" | Low-resolution input image. (LR = low resolution.) |
| $G(I_{\text{LR}})$ | "G of I-LR" | The super-resolved output the generator produces from the low-res input. |
| $\phi(\cdot)$ | "phi of dot" | Features extracted from an intermediate VGG layer. $\phi$ (Greek "phi", read "fai" or "fee") is just a name for the feature-extraction function. |
| $\|\cdot\|_2^2$ | "L2 norm squared" | Squared Euclidean distance between two feature vectors. |

**Why VGG features and not pixels?** VGG has been trained on millions of natural images. It has learned to detect edges, textures, faces, objects. Distance in VGG feature space measures *perceptual similarity* — two images can be pixel-different but feature-close (and look the same to humans), or pixel-close but feature-different (and look different). Optimizing perceptual loss gives sharper, more natural outputs than pixel losses.

SRGAN was the first to produce upscaled photos that humans preferred over pixel-loss baselines, even though its **PSNR** (pixel-level metric) was *worse*. That gap — high perceptual quality but lower PSNR — is the classic GAN trade-off in super-resolution and shows up everywhere downstream.

### 6.1.2 ESRGAN (2018)

Wang et al. improved SRGAN with three changes:

1. **Removed BatchNorm in G.** BN can cause "artifacts" in super-resolution (visible streaks). Replaced by a residual-in-residual dense block (RRDB):

```
input
  ├── 5 dense blocks (each block has internal skip connections)
  │      └── output of last block scaled by 0.2
  └── added back to input (outer residual)
```

This is a *deeper, more parameter-efficient* G than SRGAN's.

2. **Switched to Relativistic average discriminator (RaD)** — D outputs "is this image *more* real than the average fake in this batch?" (Module 2.8). This makes G push harder against the current state of fakes, leading to faster improvement.

3. **Perceptual loss before activation.** Use VGG features *before* ReLU rather than after. The "before-ReLU" features are continuous and contain more information than the sparse post-ReLU features.

ESRGAN was the new state of the art and won the PIRM2018 perceptual super-resolution challenge. It is still widely used today.

### 6.1.3 Real-ESRGAN (2021) — the deep dive

ESRGAN works beautifully on clean low-res images. But "clean" is the problem: real-world low-res photos are not just downsampled crisp images. They are:

- Phone photos that were JPEG-compressed at quality 70.
- Old scans with film grain and chromatic aberration.
- Frames from a 2009 YouTube video at 360p, recompressed three times.
- Webp-then-JPEG-then-WebP cascade artifacts.

If you train ESRGAN by downsampling clean images with bicubic interpolation and feeding them as low-res input, the model learns to invert bicubic downsampling. When you give it a real phone photo, it has *never* seen JPEG artifacts, so it tries to upscale them as if they were real detail. The result: amplified artifacts, ringing, blockiness.

**Real-ESRGAN's contribution: realistic degradation modeling.**

Instead of `low = bicubic_downsample(high)`, the authors model the actual chain of corruptions a real-world image undergoes:

```
high-res image
   ↓ blur kernel (random Gaussian / generalized Gaussian / plateau)
   ↓ resize (random bicubic / bilinear / area; up or down)
   ↓ noise (Gaussian / Poisson, random strength)
   ↓ JPEG compression (random quality 30–95)
   ↓ blur again
   ↓ resize again
   ↓ noise again
   ↓ JPEG again
   = low-res training input
```

This is called a **second-order degradation pipeline** because the corruptions are applied twice (with randomized parameters each time). It mimics how a real image actually accumulates damage on its way from a phone camera to your viewer.

Training G to invert *this* degradation, rather than a clean bicubic downsample, gives a model that works on real-world photos.

**Other Real-ESRGAN choices:**

1. **U-Net discriminator with spectral norm.** Instead of a standard convolutional classifier, D is a U-Net that outputs a per-pixel real/fake score. Why? Real photos have *spatially varying* quality — some patches are fine, some are corrupted. A U-Net D can score each patch independently and give richer gradient signal to G.

2. **Sinc filters** to model real ringing artifacts in the synthetic training pipeline.

3. **Trained on a mix of natural images + anime images** (the "anime" model is hugely popular for upscaling cartoons and old animation).

4. **Multiple model variants:**
   - `RealESRGAN_x4plus` — general-purpose 4× upscaler.
   - `RealESRGAN_x4plus_anime_6B` — smaller, optimized for anime.
   - `RealESRGAN_x2plus` — 2× upscaler.
   - `RealESRNet_x4plus` — non-GAN variant (PSNR-optimized, smoother).

### 6.1.4 Using Real-ESRGAN — code

This is the actual workflow you would use in 2026.

```bash
pip install realesrgan
```

```python
import cv2
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

# Load the RRDBNet (same as ESRGAN's G), 4x upscale, 23 residual blocks
model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                num_block=23, num_grow_ch=32, scale=4)

upsampler = RealESRGANer(
    scale=4,
    model_path='weights/RealESRGAN_x4plus.pth',  # download from official repo
    model=model,
    tile=400,      # process in 400x400 tiles to limit VRAM
    tile_pad=10,
    pre_pad=0,
    half=True,     # FP16 inference
)

img = cv2.imread('input.jpg', cv2.IMREAD_UNCHANGED)
output, _ = upsampler.enhance(img, outscale=4)
cv2.imwrite('output.png', output)
```

That is the full workflow. The library handles tiling for large images (so you do not OOM on 4K input), padding for clean boundaries, and FP16 inference for speed.

**Practical notes.**

- For anime, switch the model path to `RealESRGAN_x4plus_anime_6B.pth` and use `num_block=6, num_feat=64` in `RRDBNet`. The anime model is much smaller (~17MB vs 65MB) and gives cleaner results on cartoon content.
- For text-heavy images (screenshots, scanned documents), Real-ESRGAN can hallucinate plausible-looking but wrong characters. For documents use a model with text-specific training instead.
- For 8K → 16K with very limited VRAM, drop `tile` to 200.

**Why Real-ESRGAN is everywhere in 2026.** It is open-source (BSD-3), runs on a 4GB GPU, is fast (often 5× faster than diffusion-based upscalers per megapixel), and works on a wide range of content. It is built into the *Upscayl* open-source app, NVIDIA's *VSR* drivers, Krita's plugin ecosystem, and countless YouTube tutorials. The Real-ESRGAN ecosystem is one of the clearest cases of "GAN-based tool wins production by being fast and good enough."

### 6.1.5 Limitations of GAN super-resolution

- **Hallucination.** GAN upscalers invent details that were not in the input. If you upscale a security camera face, you get a sharp face — but it is not necessarily *the* face. Important for forensics and medical imaging.
- **PSNR vs perceptual quality trade-off.** GAN outputs always have lower PSNR than PSNR-optimized baselines, even when they look better to humans.
- **Training data bias.** Real-ESRGAN was trained on natural photos and some anime. It does not know about, say, medical CT scans or astronomical imagery.

For 2026: if you need high-quality, fast, general-purpose upscaling, use Real-ESRGAN. If you need maximum quality and have GPU time, use a diffusion-based upscaler (e.g., LDM-SR or Stable Diffusion's image-to-image with low noise).

## 6.2 Inpainting — filling in missing regions

**Task.** Given an image with some pixels masked out, fill them in plausibly.

The classic GAN approach: train G with a mask-aware loss. Inputs are `(image, mask)`. G outputs an inpainted image. D scores realism. Common variants:

- **Context Encoder (2016)** — first deep inpainting model.
- **DeepFill / GMCNN** — gated convolutions to handle irregular masks.
- **EdgeConnect** — first predict edges in the masked region, then fill colors.
- **LaMa (2021)** — uses Fourier-domain convolutions for large mask regions. Not adversarial but inspired by GAN ideas.

In 2026, diffusion-based inpainting (Stable Diffusion inpaint) dominates for quality, but GAN inpainters are still useful for speed (mobile and real-time apps).

## 6.3 GAN inversion — finding the latent for an existing image

If StyleGAN has a generator $G$ that maps latents $w$ to images $x = G(w)$, can we go the other way? Given a real photo, find the $w$ that would produce it?

That is **GAN inversion**. It enables editing real photos: invert to get $w$, modify $w$ (move in a direction that adds glasses), generate the modified image.

**Three approaches:**

### 6.3.1 Optimization-based (Image2StyleGAN, 2019)

Start with some $w_0$, and iteratively update it to minimize:

$$L_{\text{inv}}(w) = \|x - G(w)\|_{\text{pixel}}^2 + \lambda \cdot L_{\text{perceptual}}(x, G(w))$$

Standard gradient descent on $w$, using both pixel and VGG-style perceptual loss. Slow (minutes per image) but accurate.

### 6.3.2 Encoder-based (pSp, e4e, 2020)

Train a separate encoder network $E$ that learns to map images to $w$ in one forward pass. Much faster (real-time) but slightly less accurate than optimization.

The trick in **e4e** (encoder for editing): train E to produce $w$ values that lie in a "well-behaved" region of the latent space — close to the average $w$, so subsequent edits work reliably.

### 6.3.3 Hybrid

Use an encoder to get a good initial $w_0$, then run a few steps of optimization to refine. Combines speed and accuracy.

## 6.4 StyleGAN editing — moving in latent space

Once you have $w$ for a real face, you can edit by moving $w$ in specific directions:

- $w + \alpha \cdot d_{\text{smile}}$ adds a smile.
- $w + \alpha \cdot d_{\text{age}}$ ages the face.
- $w + \alpha \cdot d_{\text{glasses}}$ adds glasses.

Where do the directions $d$ come from?

- **Supervised.** Label many faces with attributes (smile/no-smile), train a linear classifier in $w$ space, use the classifier's normal vector as the direction.
- **Unsupervised (GANSpace, 2020).** PCA in $w$ space — the top principal components correspond to visually meaningful attributes.
- **Text-driven (StyleCLIP, 2021).** Use CLIP to align text prompts with directions in $w$ space. Type "give them red hair," get a direction that does that.

The **InterFaceGAN, StyleCLIP, e4e** combination became the standard pipeline for "edit a real photo with a slider" up until diffusion-based editing (InstructPix2Pix, Stable Diffusion inpainting) took over much of this in 2023–2024.

## 6.5 Deepfakes

**Task.** Swap a face in a video.

The technical pipeline (FaceSwap, DeepFaceLab):
1. Detect and align faces in source and target video frames.
2. Train an autoencoder per identity, sharing the encoder. Both autoencoders compress to the same latent space, but each has its own decoder.
3. To swap: encode a target frame with the shared encoder, decode with the source person's decoder.

A **GAN discriminator** is often added on top of the autoencoder output to sharpen the final result. The autoencoder gives a blurry but identity-correct face; the GAN sharpens it.

Production deepfake tools (DeepFaceLab, ReFace, FaceFusion) use variations of this.

**Ethical notes.** Deepfakes are a clear dual-use technology. Beyond entertainment, they enable harassment, fraud, and non-consensual imagery. Detection research (DFDC dataset, deepfake forensics) is an active counter-area. If you build with deepfake tools, follow consent norms and disclosure laws in your jurisdiction.

## 6.6 Data augmentation with GANs

Generated samples can augment training sets for downstream classifiers. Common in medical imaging where real data is scarce and labeled data even scarcer.

- **GAN-augmented training sets** can improve classifier accuracy by 1–3% on small datasets.
- Risk: if your GAN has biases (mode dropping), your downstream model inherits them.

This is a quieter application but a common one in research labs.

## Key papers

- Ledig et al., *Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network (SRGAN)*, CVPR 2017.
- Wang et al., *ESRGAN: Enhanced Super-Resolution Generative Adversarial Networks*, ECCVW 2018.
- Wang et al., *Real-ESRGAN: Training Real-World Blind Super-Resolution with Pure Synthetic Data*, ICCVW 2021.
- Pathak et al., *Context Encoders*, CVPR 2016 (inpainting).
- Abdal et al., *Image2StyleGAN: How to Embed Images Into the StyleGAN Latent Space?*, ICCV 2019.
- Tov et al., *Designing an Encoder for StyleGAN Image Manipulation (e4e)*, SIGGRAPH 2021.
- Patashnik et al., *StyleCLIP: Text-Driven Manipulation of StyleGAN Imagery*, ICCV 2021.

## Exercises

1. Run Real-ESRGAN on a 480p YouTube screenshot. Compare to bicubic upscaling. Identify three regions where Real-ESRGAN hallucinates (invents detail) versus restores detail.
2. Train a small ESRGAN on a custom dataset (e.g., 1,000 of your own photos). Compare PSNR and visual quality to the official checkpoint.
3. Find a pretrained StyleGAN2 checkpoint and the official `encoder4editing` (e4e) repo. Invert a photo of yourself. Then edit your photo to add glasses using a precomputed direction.
4. Read the Real-ESRGAN paper. List the **specific** augmentations the authors apply in the second-order degradation pipeline. Match each one to a real-world image artifact.
