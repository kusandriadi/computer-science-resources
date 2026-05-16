# Module 8 — End-to-End: A Complete Runnable GAN

This module ties everything together: a complete DCGAN trainer for MNIST. ~250 lines, fully commented. You can paste it into a `train.py` file and run it.

## Learning goals

- See every concept from Modules 1–5 in one place: G, D, the training loop, the non-saturating loss, FID computation.
- Have a working baseline you can modify for your own datasets.

## 8.1 Requirements

```bash
pip install torch torchvision torch-fidelity
```

You will need a GPU to train comfortably in under an hour. CPU works but will be slow (overnight).

## 8.2 The complete code

Save as `train.py` and run with `python train.py`.

```python
"""
Minimal DCGAN trainer for MNIST.

Concepts: Modules 1-5 of the handbook
- Vanilla GAN with non-saturating loss (Module 1, 2)
- DCGAN architecture (Module 3)
- BatchNorm in G, no BN in D (Module 3.6.2)
- LeakyReLU in D, ReLU in G (Module 3.6.2)
- Adam(beta1=0.5) (Module 3.6.3)
- EMA of G for inference (Module 3.6.3)
- FID at the end (Module 5.3)
"""
import os
import copy
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, utils

# -------- Hyperparameters --------
Z_DIM       = 100
IMG_SIZE    = 32          # 28 -> 32 by padding so DCGAN dims work
BATCH_SIZE  = 128
LR_G        = 1e-4
LR_D        = 4e-4        # TTUR: D learns faster (Module 3.6.1)
BETA1, BETA2 = 0.5, 0.999
EPOCHS      = 30
EMA_DECAY   = 0.999
SAMPLE_EVERY = 1           # save grid every N epochs
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

os.makedirs("samples", exist_ok=True)
os.makedirs("checkpoints", exist_ok=True)


# -------- Generator --------
class Generator(nn.Module):
    """DCGAN G, scaled for 32x32 grayscale."""
    def __init__(self, z_dim=Z_DIM, ngf=64):
        super().__init__()
        self.net = nn.Sequential(
            # input: (z_dim, 1, 1) -> 4x4
            nn.ConvTranspose2d(z_dim, ngf*4, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf*4),
            nn.ReLU(True),
            # 4x4 -> 8x8
            nn.ConvTranspose2d(ngf*4, ngf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*2),
            nn.ReLU(True),
            # 8x8 -> 16x16
            nn.ConvTranspose2d(ngf*2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf),
            nn.ReLU(True),
            # 16x16 -> 32x32, single-channel output
            nn.ConvTranspose2d(ngf, 1, 4, 2, 1, bias=False),
            nn.Tanh(),
        )

    def forward(self, z):
        return self.net(z.view(z.size(0), -1, 1, 1))


# -------- Discriminator --------
class Discriminator(nn.Module):
    """DCGAN D, scaled for 32x32 grayscale. No BN in first layer."""
    def __init__(self, ndf=64):
        super().__init__()
        self.net = nn.Sequential(
            # 32x32 -> 16x16
            nn.Conv2d(1, ndf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            # 16x16 -> 8x8
            nn.Conv2d(ndf, ndf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf*2),
            nn.LeakyReLU(0.2, inplace=True),
            # 8x8 -> 4x4
            nn.Conv2d(ndf*2, ndf*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf*4),
            nn.LeakyReLU(0.2, inplace=True),
            # 4x4 -> 1x1
            nn.Conv2d(ndf*4, 1, 4, 1, 0, bias=False),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.net(x).view(-1)


# -------- Weight init (DCGAN standard) --------
def weights_init(m):
    cls = m.__class__.__name__
    if "Conv" in cls:
        nn.init.normal_(m.weight.data, 0.0, 0.02)
    elif "BatchNorm" in cls:
        nn.init.normal_(m.weight.data, 1.0, 0.02)
        nn.init.constant_(m.bias.data, 0)


# -------- EMA helper --------
@torch.no_grad()
def update_ema(ema_model, model, decay=EMA_DECAY):
    for p_ema, p in zip(ema_model.parameters(), model.parameters()):
        p_ema.data.mul_(decay).add_(p.data, alpha=1 - decay)


# -------- Training --------
def main():
    # Dataset: MNIST normalized to [-1, 1]
    tf = transforms.Compose([
        transforms.Resize(IMG_SIZE),
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,)),
    ])
    dataset = datasets.MNIST(root="data", train=True, download=True, transform=tf)
    loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True,
                        num_workers=2, drop_last=True)

    G = Generator().to(DEVICE)
    D = Discriminator().to(DEVICE)
    G.apply(weights_init)
    D.apply(weights_init)

    # EMA copy of G, only used for sampling
    G_ema = copy.deepcopy(G).eval()
    for p in G_ema.parameters():
        p.requires_grad_(False)

    opt_G = optim.Adam(G.parameters(), lr=LR_G, betas=(BETA1, BETA2))
    opt_D = optim.Adam(D.parameters(), lr=LR_D, betas=(BETA1, BETA2))

    # Fixed noise for visual progress tracking
    fixed_z = torch.randn(64, Z_DIM, device=DEVICE)

    step = 0
    for epoch in range(1, EPOCHS + 1):
        for real, _ in loader:
            real = real.to(DEVICE)
            B = real.size(0)

            # ---- 1) Train Discriminator ----
            z = torch.randn(B, Z_DIM, device=DEVICE)
            fake = G(z).detach()

            d_real = D(real)
            d_fake = D(fake)

            # Non-saturating BCE (Module 2.2)
            eps = 1e-8
            loss_D = -(torch.log(d_real + eps).mean()
                       + torch.log(1 - d_fake + eps).mean())

            opt_D.zero_grad()
            loss_D.backward()
            opt_D.step()

            # ---- 2) Train Generator ----
            z = torch.randn(B, Z_DIM, device=DEVICE)
            fake = G(z)
            d_fake = D(fake)

            # Non-saturating G loss
            loss_G = -torch.log(d_fake + eps).mean()

            opt_G.zero_grad()
            loss_G.backward()
            opt_G.step()

            # ---- 3) EMA update ----
            update_ema(G_ema, G)

            step += 1
            if step % 200 == 0:
                print(f"epoch {epoch:02d}  step {step:05d}  "
                      f"D {loss_D.item():.3f}  G {loss_G.item():.3f}  "
                      f"D(real) {d_real.mean().item():.3f}  "
                      f"D(fake) {d_fake.mean().item():.3f}")

        # ---- end of epoch: save samples ----
        if epoch % SAMPLE_EVERY == 0:
            G_ema.eval()
            with torch.no_grad():
                samples = G_ema(fixed_z).cpu()
            samples = (samples + 1) / 2  # back to [0, 1]
            utils.save_image(samples, f"samples/epoch_{epoch:03d}.png",
                             nrow=8)
            print(f"saved samples/epoch_{epoch:03d}.png")

    # ---- save final checkpoint ----
    torch.save({
        "G": G.state_dict(),
        "G_ema": G_ema.state_dict(),
        "D": D.state_dict(),
    }, "checkpoints/final.pt")
    print("done. checkpoint saved to checkpoints/final.pt")


if __name__ == "__main__":
    main()
```

## 8.3 Running it

```bash
python train.py
```

On a single RTX 3060 you should see:
- First epoch: ~30 seconds.
- Sample at epoch 1: barely recognizable digits.
- Sample at epoch 10: clear digits, occasional weird shapes.
- Sample at epoch 30: sharp, varied MNIST.

## 8.4 What to expect — and what to look for

Look at the printed log:

```
epoch 01  step 00200  D 0.892  G 1.234  D(real) 0.781  D(fake) 0.234
epoch 02  step 00400  D 0.654  G 1.456  D(real) 0.834  D(fake) 0.187
...
```

Healthy training signs:

- **`D(real)` stays around 0.7–0.95.** Not too high (D winning).
- **`D(fake)` stays around 0.1–0.3.** Not 0 (vanishing gradient — Module 1.5.2).
- **`D loss` around 0.5–1.0.** Not 0 (D too strong) and not stuck at $\ln(4) \approx 1.39$ (D too weak — Module 1.5.3).
- **`G loss` around 1.0–3.0.** Bouncing around, not exploding.
- **Sample diversity** — open the grid images. Are you seeing all 10 digits? If only a few digits, you have mode collapse (Module 1.5.1).

## 8.5 Computing FID

After training, compute FID using `torch-fidelity`:

```python
"""eval_fid.py — Compute FID after training."""
import torch
from torchvision import datasets, transforms, utils
import torch_fidelity
import os
from train import Generator, Z_DIM, IMG_SIZE, DEVICE   # reuse model + params

# Load EMA generator
ckpt = torch.load("checkpoints/final.pt", map_location=DEVICE)
G = Generator().to(DEVICE)
G.load_state_dict(ckpt["G_ema"])
G.eval()

# Generate 10,000 samples to disk
os.makedirs("fid_gen", exist_ok=True)
with torch.no_grad():
    for i in range(10000 // 100):
        z = torch.randn(100, Z_DIM, device=DEVICE)
        x = G(z)
        x = ((x + 1) / 2).clamp(0, 1)
        for j, img in enumerate(x):
            utils.save_image(img, f"fid_gen/{i*100+j:05d}.png")

# Save 10K real MNIST samples too
os.makedirs("fid_real", exist_ok=True)
tf = transforms.Compose([transforms.Resize(IMG_SIZE), transforms.ToTensor()])
mnist = datasets.MNIST(root="data", train=True, download=True, transform=tf)
for i in range(10000):
    img, _ = mnist[i]
    utils.save_image(img, f"fid_real/{i:05d}.png")

# Compute FID
metrics = torch_fidelity.calculate_metrics(
    input1="fid_gen",
    input2="fid_real",
    fid=True, isc=True,
    verbose=False,
)
print(metrics)
```

A well-trained DCGAN on MNIST should land at FID ≈ 5–10. Anything higher than 30 means something is wrong (mode collapse or training instability).

## 8.6 Extensions for practice

The code above is the floor. Things to try, in order of effort:

1. **Switch to hinge loss** (Module 2.7). Replace the BCE in the D and G steps with hinge formulas. Compare FID.
2. **Add spectral normalization to D** (Module 3.6.3). `nn.utils.spectral_norm` wraps each conv. See if it improves stability.
3. **Switch to CIFAR-10** (3 channels, 32×32). Same architecture except `out_channels=3` in G and `in_channels=3` in D. FID will be much higher (~30–60 with a vanilla DCGAN). To get to FID ~10 on CIFAR-10 you need to add SN, hinge, and a bigger model.
4. **Conditional generation.** Add a class-label embedding to both G and D (Module 4.1). Generate specific digits on demand.
5. **Make a class-conditional CIFAR-10 GAN.** Combine 3 and 4. Try to reach FID 20 with hinge + SN + class conditioning.

## 8.7 Common bugs and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `D(real)` = 0.5 forever, `D(fake)` = 0.5 forever | LR too high, training unstable | Halve `LR_D` and `LR_G` |
| `D(real)` jumps to 1.0 in epoch 1 | D too strong | Raise `LR_G` or lower `LR_D`; reduce D depth |
| Samples are all the same image | Mode collapse | Switch to hinge + SN (try the exercises) |
| Samples become solid gray over time | G crashed | Likely NaN in losses — check for log(0); add `eps` to logs |
| FID is great but samples look bad | Memorization or bug in FID | Visual check; ensure `G_ema.eval()` and proper denormalization |

## Exercises

1. Run the code as-is. Confirm you get readable digits by epoch 10.
2. Implement the hinge loss variant from Module 2.7. Compare FID at epoch 30.
3. Replace `BatchNorm2d` in D with `spectral_norm` wraps. Compare stability and FID.
4. Run the same code on CIFAR-10. Record the failure modes you observe.
