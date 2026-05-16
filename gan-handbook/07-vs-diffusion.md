# Module 7 — GAN vs Diffusion in 2026

In 2014, GANs were the most exciting idea in generative modeling. By 2022 they had been overtaken by **diffusion models**, which now dominate text-to-image, video generation, and audio synthesis. This module is the honest comparison: when are GANs still the right choice, and what is happening in the hybrid space?

## Learning goals

By the end of this module you can:

- Sketch how a diffusion model generates an image, in plain English.
- Compare GANs and diffusion models on speed, quality, diversity, controllability, and training.
- Name the places where GANs still win in 2026.
- Decide between GAN and diffusion for a new project.
- Answer "is GAN research dead?" with evidence.

## 7.1 What a diffusion model does, briefly

To compare them, you need a tiny mental model of diffusion. Skip this section if you already know it.

A diffusion model is a denoiser. Training:

1. Take a real image.
2. Add a little Gaussian noise.
3. Train a neural network to predict that noise so you can subtract it back.
4. Repeat with more noise, even more noise, ..., all the way until the image is pure noise.

The network learns "given any noisy image at any noise level, predict the noise."

Generation:

1. Start with pure Gaussian noise.
2. Predict noise. Subtract a small step of it.
3. The image is now slightly less noisy.
4. Repeat 20–50 times.

After enough steps, the noise has been cleaned away and a real-looking image emerges. The key trade-off: **generation requires many forward passes** (20–50 typically, sometimes hundreds for highest quality).

## 7.2 The head-to-head comparison

| Dimension | GANs | Diffusion |
|---|---|---|
| **Inference speed** | One forward pass. Fast — milliseconds on a GPU. | 20–50 forward passes typically. Slower — seconds on a GPU. |
| **Training speed** | Hours to days on small datasets. | Days to weeks for state of the art. |
| **Training stability** | Famously fragile. Mode collapse, vanishing grads. | Stable. Drop in a U-Net + MSE loss, it just works. |
| **Sample quality (image)** | Excellent at narrow domains (faces, anime). Behind diffusion on diverse domains. | State of the art at scale. |
| **Sample diversity** | Mode collapse risks low diversity. | Built-in diversity from the stochastic sampling. |
| **Likelihood** | None. Implicit model. | Can compute (a bound on) likelihood. |
| **Controllability** | Limited. Conditional cGAN, StyleGAN latent editing. | Strong. Classifier-free guidance, text conditioning, ControlNet, inpaint masks. |
| **Memory at inference** | Small. Just the generator. | Larger. Need to hold model + sampling state. |
| **Code complexity** | Two networks, asymmetric losses, careful tuning. | One network, plain MSE loss, straightforward. |
| **Hardware needs (inference)** | Runs on a CPU for small models. Mobile-friendly. | Usually needs a GPU. Mobile versions are hot research. |
| **State of the art for text-to-image** | No. | Yes (Stable Diffusion 3, Flux, DALL-E 4, Imagen 3). |
| **State of the art for face generation at 1024×1024** | StyleGAN3 still competitive. | Diffusion also works but slower. |
| **State of the art for super-resolution** | Real-ESRGAN dominates production. | Diffusion upscalers exist but slower. |
| **State of the art for audio vocoding** | HiFi-GAN. | Diffusion vocoders exist; HiFi-GAN still preferred for speed. |

## 7.3 Where GANs still win in 2026

**Speed-critical applications.** Any place where you need to generate at 30+ fps:
- Real-time video filters (face beautification, background replacement, AR effects).
- Live video upscaling (NVIDIA VSR, YouTube's enhanced playback).
- Game asset generation in real time.
- Camera-pipeline image processing on phones.

A single-step GAN runs in 10–30 ms on a phone. A 25-step diffusion model needs 250–750 ms even with aggressive optimization. For interactive use, this difference is decisive.

**Vocoders in text-to-speech.** Modern TTS systems are usually a two-stage pipeline:
- Stage 1: a model produces a mel-spectrogram from text.
- Stage 2: a vocoder converts the mel-spectrogram to a waveform.

The vocoder runs at audio sample rate (16 kHz–48 kHz), which is brutal for any per-step model. **HiFi-GAN** (Kong et al., 2020) is the standard vocoder because it produces one waveform sample per forward pass and sounds excellent. Even systems with diffusion-based stage 1 use HiFi-GAN at stage 2.

**Specialized super-resolution.** Real-ESRGAN, Real-CUGAN, and SwinIR-GAN are the production choices when you need to upscale 8K video frames or process millions of images. Diffusion-based upscalers (LDM-SR) produce slightly nicer results but are too slow for these workflows.

**On-device generative apps.** Running a GAN on a $300 phone is realistic in 2026. Running a diffusion model with comparable quality is still difficult unless you accept a 5-second wait per image.

## 7.4 Where diffusion has won (and is unlikely to lose)

- **General-purpose text-to-image.** Stable Diffusion, Flux, DALL-E, Imagen — all diffusion. GAN attempts (GigaGAN, StyleGAN-T) are interesting but well behind.
- **Diverse, multi-modal output.** Diffusion samples are naturally diverse because of the stochastic sampling. GANs need careful tricks (truncation, multiple seeds) to match this.
- **Editing with masks and instructions.** Inpainting, instructed editing (InstructPix2Pix), and ControlNet-style conditioning are easier in diffusion because intermediate denoising states give natural editing points.
- **Video generation.** Sora, Veo, Runway Gen-3, Kling — all diffusion-based.

## 7.5 Hybrids — the interesting middle ground

The 2023–2026 wave of generative research is increasingly *not pure diffusion or pure GAN*. Three threads matter.

### 7.5.1 Adversarial Diffusion Distillation (SD-Turbo, 2023)

The idea: train a fast student network to mimic a slow diffusion teacher *with adversarial supervision*.

- Teacher: 25-step Stable Diffusion.
- Student: a 1-step generator (basically a GAN).
- Loss: student must match teacher's outputs (distillation) **AND** fool a discriminator that compares student outputs to real images (adversarial).

Result: SD-Turbo produces images in a single step that approach 25-step Stable Diffusion quality. The trick is that the adversarial loss pulls the student toward "realistic" rather than just "matching teacher" — which would average too much detail away.

This is a clear example of GAN-style training making diffusion practical for real-time use.

### 7.5.2 Consistency Models (2023)

Song et al. propose to train a network that maps **any** noisy state along the diffusion trajectory directly to the final image. Once trained, you can sample in **one step** like a GAN, but also in 2 or 4 steps for better quality.

Pure consistency models (no adversarial loss) work but produce slightly blurry results. Combining with adversarial loss (Multistep Consistency, Consistency Trajectory Models) gets sharper results — again, GAN-style adversarial supervision rescues diffusion at low step counts.

### 7.5.3 Diffusion-GAN (2022)

Take a GAN. Add Gaussian noise of varying levels to **both** the real and the generated images before showing them to D. Train D to discriminate real-noisy vs fake-noisy at every noise level.

This "smooths" the discriminator's task. D is no longer judging just "real vs fake at zero noise" — it sees noisy versions too, which prevents overfitting and gives better gradient signal across many noise levels. GANs trained this way are more stable and can match diffusion quality on some benchmarks.

### 7.5.4 The pattern

Notice the pattern: when you want **speed**, you take a diffusion model and bolt GAN-style supervision onto it. When you want **stability**, you take a GAN and bolt diffusion-style noisy supervision onto it.

This is not a coincidence. The two families are converging.

## 7.6 Is GAN research dead?

Short answer: **no, but it has narrowed.**

Honest data points:

- **Citations to GAN papers** are still high but declining year-over-year since 2022. Most new generative-modeling work cites both GAN and diffusion baselines.
- **NeurIPS / ICML / CVPR submissions** with "GAN" in the title peaked around 2019–2020 and have been declining. "Diffusion" titles overtook them in 2022.
- **Production deployments** of GAN-based tools (Real-ESRGAN, HiFi-GAN, StyleGAN-based avatars) are growing, not shrinking. Production is the lagging indicator: tools that work get adopted.

What is happening:

1. **GAN research is specializing.** Less "general image generation," more "real-time generation," "small models," "domain-specific GANs" (medical, scientific, audio).
2. **GAN-style techniques are reabsorbed into diffusion.** As we saw above, adversarial training is a key ingredient in fast diffusion models (SD-Turbo, distilled SDXL).
3. **GAN engineering knowledge is still load-bearing.** If you want to ship a fast, on-device generative product in 2026, you still need to know mode collapse, FID, and spectral normalization.

A reasonable prediction for the next few years (2026–2028):

- GANs continue as the workhorse for **speed-critical** tasks: vocoding, super-resolution, real-time AR, on-device.
- Diffusion continues as the workhorse for **quality- and control-critical** tasks: text-to-image, text-to-video, editing.
- The boundary blurs. Most new generative systems use both.

## 7.7 Choosing for your project — a decision tree

```
Do you need real-time generation (>30 fps)?
├── YES → GAN. (Real-ESRGAN, HiFi-GAN, StyleGAN3 for video)
└── NO
    ├── Do you need text conditioning?
    │   ├── YES → Diffusion. (Stable Diffusion 3, Flux)
    │   └── NO
    │       ├── Is your domain small/specialized (faces, anime, medical, audio)?
    │       │   ├── YES → GAN can win. Try StyleGAN-ADA first; only escalate to diffusion if needed.
    │       │   └── NO → Diffusion is the safe default for general image generation.
    │       └── Are you GPU-poor?
    │           ├── YES → GAN. One forward pass is much cheaper.
    │           └── NO → Either works. Pick by which library has better support for your task.
```

## Key papers and references

- Ho et al., *Denoising Diffusion Probabilistic Models*, NeurIPS 2020. (Modern diffusion paper.)
- Sauer et al., *Adversarial Diffusion Distillation*, 2023. (SD-Turbo.)
- Song et al., *Consistency Models*, ICML 2023.
- Wang et al., *Diffusion-GAN: Training GANs with Diffusion*, ICLR 2023.
- Kong et al., *HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis*, NeurIPS 2020.
- Kang et al., *Scaling up GANs for Text-to-Image Synthesis (GigaGAN)*, CVPR 2023.

## Exercises

1. Find an inference-speed benchmark for SD-Turbo vs full Stable Diffusion. Note the trade-off: how much quality is lost for how much speed gained?
2. Read the HiFi-GAN paper. Identify the specific architectural choices that let it produce one audio sample per forward pass.
3. Pick a generative task you care about. Use the decision tree to choose GAN or diffusion. Justify in three sentences.
4. Read the Consistency Models paper, sections 1–3. Sketch in your own words how a Consistency Model is trained and how it samples in 1 step.
