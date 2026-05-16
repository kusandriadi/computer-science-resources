# Appendix A — Toolkit

The libraries, repos, and tools you will actually use in 2026.

## Core: PyTorch

PyTorch is the default framework for GAN research and most production work. Why not TensorFlow or JAX?

- **Most papers ship PyTorch reference code.** Reproducing results is much easier when you do not need to translate.
- **Spectral normalization and weight init helpers** are built in (`torch.nn.utils.spectral_norm`, `nn.init.*`).
- **Automatic mixed precision (AMP)** via `torch.cuda.amp` for FP16 training — important for GANs at scale.

A minimal training loop pattern you will repeat constantly:

```python
opt = torch.optim.Adam(net.parameters(), lr=1e-4, betas=(0.5, 0.999))
scaler = torch.cuda.amp.GradScaler()  # for FP16

for x in loader:
    with torch.cuda.amp.autocast():
        out = net(x)
        loss = loss_fn(out)
    opt.zero_grad()
    scaler.scale(loss).backward()
    scaler.step(opt)
    scaler.update()
```

## Evaluation: `clean-fid` and `torch-fidelity`

For FID, IS, KID, and Precision-Recall.

- **`clean-fid`** ([GitHub](https://github.com/GaParmar/clean-fid)) — strict reproducibility. Use this if you want results comparable to published papers. Handles image preprocessing consistently (which is where most FID discrepancies come from).
- **`torch-fidelity`** ([GitHub](https://github.com/toshas/torch-fidelity)) — broader feature set. Computes IS, FID, KID in one call.

```python
import torch_fidelity
m = torch_fidelity.calculate_metrics(
    input1="path/to/generated",
    input2="path/to/real",
    fid=True, isc=True, kid=True,
)
print(m)
```

## Architectures: lucidrains' repositories

[Phil Wang (`lucidrains`)](https://github.com/lucidrains) maintains clean, single-file PyTorch implementations of many GAN papers:

- `stylegan2-pytorch` — StyleGAN2 you can read in one sitting.
- `lightweight-gan` — a fast, low-data-friendly GAN.
- `pix2pix-pytorch` — Pix2Pix in compact form.

These are excellent for learning. For production, use the official NVIDIA or paper-author repos instead.

## Official paper repositories worth bookmarking

- **StyleGAN3 (NVIDIA)**: [github.com/NVlabs/stylegan3](https://github.com/NVlabs/stylegan3). The reference implementation. Heavy build setup but excellent code.
- **Real-ESRGAN (xinntao)**: [github.com/xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN). Production-quality super-resolution.
- **CycleGAN / Pix2Pix (junyanz)**: [github.com/junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix). The canonical image-translation repo.
- **HiFi-GAN (jik876)**: [github.com/jik876/hifi-gan](https://github.com/jik876/hifi-gan). The vocoder.

## Augmentation: `kornia` and StyleGAN-ADA's pipeline

- **kornia** — differentiable image augmentations in PyTorch. Useful when you want augmentation gradients (rare but used in some adversarial training).
- **StyleGAN-ADA** has its own augmentation pipeline you can lift for any GAN. The code is `training/augment.py` in NVIDIA's repo.

For a quick start without StyleGAN, use `torchvision.transforms` for basic augmentation.

## Experiment tracking: Weights & Biases or TensorBoard

GAN training has many metrics over many runs. You will lose track without a tracker.

- **W&B** is the most popular for research. Free for personal use. Logs scalars, sample grids, and configs.
- **TensorBoard** is built into PyTorch (`torch.utils.tensorboard`). Local-only. Less convenient for sharing.

Minimum to track:

- `D(real)`, `D(fake)` (these tell you if D is winning).
- `loss_D`, `loss_G`.
- A sample grid every N epochs.
- FID every 5–10 epochs (more frequent on small datasets).

## Dataset prep: `ffcv` for speed; `albumentations` for variety

GAN training is often **I/O bound** at 1024×1024. The dataloader becomes the bottleneck before the GPU.

- **`ffcv`** ([GitHub](https://github.com/libffcv/ffcv)) — pack your dataset into an optimized format. 5–10× speed up over `ImageFolder` for image GANs.
- **`albumentations`** — fast CPU augmentations (faster than `torchvision.transforms`).

For datasets under 10K images, `ImageFolder` is fine.

## Pretrained models: Hugging Face

Many GAN checkpoints are on the [Hugging Face Hub](https://huggingface.co/models). Search for "GAN", "StyleGAN", "ESRGAN" tags. Often easier than chasing down individual paper-author Google Drive links.

For Real-ESRGAN specifically, the official `.pth` files are at the [Real-ESRGAN releases page](https://github.com/xinntao/Real-ESRGAN/releases).

## Diffusion library, for comparisons

When you need to compare to a diffusion baseline (or build a hybrid), use **`diffusers`** (Hugging Face):

```python
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-3-medium")
img = pipe("a photo of a cat").images[0]
```

`diffusers` also has GAN-style components (e.g., adversarial training utilities for SD-Turbo).

## Misc useful utilities

- **`pytorch-lightning`** — if you want to skip writing training boilerplate. Some GAN code is awkward in Lightning because of multiple optimizers; weigh whether it is worth it.
- **`accelerate`** — Hugging Face's distributed training helper. Easier than raw `DistributedDataParallel`.
- **`einops`** — `rearrange`, `reduce`, `repeat`. Cleans up tensor manipulation code, especially with attention.
- **`opencv-python`** — for image I/O and preprocessing when you want speed and don't need PyTorch's abstractions.

## A minimal "I am starting a GAN project" environment

```bash
pip install torch torchvision
pip install torch-fidelity clean-fid
pip install wandb  # or tensorboard
pip install opencv-python pillow
pip install einops
```

This is enough to train, evaluate, and track any GAN in this handbook.
