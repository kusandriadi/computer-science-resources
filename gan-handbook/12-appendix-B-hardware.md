# Appendix B — Hardware

What hardware you actually need, what is overkill, and how to fit a real GAN on a small GPU.

## VRAM by use case (2026 estimates)

These assume FP16 (mixed precision) where possible, and batch size 16 unless noted.

| Use case | Min VRAM | Comfortable VRAM | Notes |
|---|---|---|---|
| MNIST DCGAN (32×32) | 2 GB | 4 GB | Fits on almost anything. |
| CIFAR-10 GAN (32×32) | 4 GB | 8 GB | Add SN, hinge — still fits. |
| CelebA 64×64 GAN | 6 GB | 12 GB | DCGAN-style; bigger if you go to 128×128. |
| StyleGAN2 at 256×256 (FFHQ subset) | 10 GB | 16 GB | Tight; use gradient checkpointing if 10 GB. |
| StyleGAN2 at 1024×1024 | 24 GB | 32 GB+ | Why people use A100/H100 for this. |
| StyleGAN3 at 1024×1024 | 32 GB | 40 GB+ | Heavier than SG2. |
| Real-ESRGAN training | 16 GB | 24 GB | Heavy due to high-res input. |
| Real-ESRGAN **inference** | 2 GB | 4 GB | With tile=400. |
| HiFi-GAN training | 4 GB | 8 GB | Audio is cheap compared to images. |
| Pix2Pix at 256×256 | 6 GB | 12 GB | |
| CycleGAN at 256×256 | 8 GB | 16 GB | 4 networks in memory. |

## Choosing a GPU in 2026

The economics are dominated by VRAM. CUDA core count matters for speed; VRAM determines what you can train at all.

**For students and hobbyists:**
- **RTX 4060 Ti 16GB** — best price-to-VRAM ratio. Trains everything in this handbook except 1024×1024 GANs.
- **RTX 4070 Ti Super 16GB** — same VRAM, more speed.
- **RTX 3090 24GB (used)** — still excellent. Older, but the 24 GB lets you train StyleGAN2 at 1024×1024.

**For researchers and serious work:**
- **RTX 4090 24GB** — fastest consumer GPU for GANs.
- **A100 40/80GB / H100 80GB** — datacenter cards. If you have access via a lab or cloud, use them.

**Cloud options (rough Q1 2026 pricing, varies):**
- Lambda Labs: A100 40GB at $1.10/hr. Best price for serious training.
- Vast.ai: RTX 4090s often available at $0.40–$0.80/hr. Variable reliability.
- RunPod: similar to Vast.
- Colab Pro: T4/A100 spot access. Cheap but uncontrolled session lengths.

**Apple Silicon (M2/M3 Pro/Max/Ultra):** can train small GANs via PyTorch's MPS backend, but slowly. Inference (Real-ESRGAN, StyleGAN) works fine. Not the right choice if you plan to train often.

## Training time benchmarks

A useful "feel" for how long things take. Times on a single RTX 4090 unless noted.

| Task | Time |
|---|---|
| MNIST DCGAN, 30 epochs | 20 min |
| CIFAR-10 DCGAN, 100 epochs | 1 h |
| CelebA-HQ StyleGAN2 256×256, 1k kimg | 10 h |
| CelebA-HQ StyleGAN2 1024×1024, 25k kimg (paper-grade) | 5–7 days |
| Real-ESRGAN x4plus, full training on DIV2K + Flickr2K | 1 week |
| CycleGAN horse↔zebra | 1 day |
| HiFi-GAN universal, full training | 1 week on a single 4090, 1 day on 8× A100 |

Notes on terminology: **kimg** means "thousand images shown to D." 25k kimg = 25 million images shown. This is the standard unit in StyleGAN papers.

## Mixed precision and gradient accumulation

Two essential tricks when VRAM is tight:

**Mixed precision (FP16/AMP)** halves VRAM use with little quality loss:

```python
scaler = torch.cuda.amp.GradScaler()
for batch in loader:
    with torch.cuda.amp.autocast():
        loss = compute_loss(batch)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

Gotcha: not all GAN losses are stable in FP16. WGAN-GP's gradient penalty can NaN. If you see NaNs, exclude the gradient penalty computation from `autocast`.

**Gradient accumulation** lets you simulate a larger batch with less VRAM. Effective batch = `micro_batch * accum_steps`:

```python
for i, batch in enumerate(loader):
    loss = compute_loss(batch) / accum_steps
    loss.backward()
    if (i + 1) % accum_steps == 0:
        opt.step()
        opt.zero_grad()
```

BigGAN-style training (large effective batch) is hard without this on consumer GPUs.

## Dataset preparation

GAN training spends a lot of time loading images. The pipeline matters.

**For 1M+ images at high res:**

1. Pre-resize all images to the target resolution. Store as JPEG quality 95 or as PNG. Avoid storing 8K originals if you train at 1024×1024.
2. Pack into an efficient format. `ffcv` and `webdataset` are both good. Plain `ImageFolder` reads from many small files and slows down.
3. Use enough `num_workers` to keep the GPU fed. Typically `num_workers=4` on a 4-core CPU, `num_workers=8+` on a workstation. Monitor GPU utilization — if it's under 90%, your loader is the bottleneck.

**For under 100K images:** keep it simple. `ImageFolder` + 4 workers is fine.

## Disk space

Often underestimated.

- Pretrained checkpoints: 50 MB (Real-ESRGAN small) to 2 GB (Stable Diffusion). Plan for 50–100 GB total.
- Training data: 1 GB (MNIST) to 100+ GB (FFHQ at 1024×1024).
- Training outputs: a long StyleGAN run produces 50–100 GB of intermediate checkpoints. Keep auto-delete.

A 1 TB NVMe is the right baseline. 2 TB if you collect datasets.

## Power, heat, and noise

Practical things people forget:

- A 4090 draws 450 W under full load. Your PSU needs 850 W minimum, 1000 W to be safe.
- 1 week of training pulls ~75 kWh. At $0.20/kWh, that's $15 of electricity per run. Worth keeping in mind for "let me restart training with a slightly different LR" decisions.
- GPUs idle at 25–35 °C; under GAN load, expect 70–80 °C and high fan noise. Good airflow matters.

## Distributed training

If you have 2+ GPUs:

- **`torch.nn.parallel.DistributedDataParallel`** (DDP) is the standard. Treat each GPU as a separate process.
- **Hugging Face `accelerate`** wraps DDP with much less boilerplate. Recommended unless you have specific reasons to write raw PyTorch.
- For multi-node training (8+ GPUs), use a managed setup — Slurm, Kubernetes, or your cloud provider's scheduler.

GANs are slightly harder to distribute than single-network models because of the alternating updates and the synchronization of multiple optimizers. Most issues are subtle bugs from forgetting to wrap both G and D in DDP, or not synchronizing batch norm statistics.

## A practical "I have a 12 GB GPU" recipe

What you can realistically train on a single RTX 3060 / 4070 12GB:

- DCGAN / hinge-SN GAN on CIFAR-10 — easy, batch 128.
- CelebA at 128×128 — fine, batch 32.
- StyleGAN2 at 256×256 — possible with batch 16 and gradient checkpointing.
- StyleGAN2 at 1024×1024 — no, you need 24+ GB.
- Real-ESRGAN inference (any image) — yes, with tiling.
- Real-ESRGAN training — no, need 24+ GB.

If your project requires 1024×1024 StyleGAN or Real-ESRGAN training, rent cloud GPUs for the actual training and prototype locally at lower resolution.
