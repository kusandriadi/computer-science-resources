# Module 3 — Architectures

The losses in Module 2 are *what* you optimize. The architecture is *the shape of the function* you are training. This module walks through the famous GAN architectures in roughly historical order, then ends with a section on what happens when you modify G or D.

## Learning goals

By the end of this module you can:

- Sketch a DCGAN generator and discriminator.
- Explain progressive growing and why it helped.
- Read a StyleGAN block diagram.
- Predict what will likely happen if you add a layer, swap a normalization, or change an activation.

## 3.1 DCGAN — Deep Convolutional GAN (2015)

The original GAN paper used MLPs and only worked on tiny images. **DCGAN** (Radford et al., 2015) was the first to scale to 64×64 with stable training. It is still the "Hello, World" of GAN architecture.

**Key design choices**, almost all of which are still used today:

1. **All-convolutional.** No fully connected layers, no pooling. G uses transposed convolutions (also called "deconvolutions") to upsample. D uses strided convolutions to downsample.
2. **BatchNorm in G**, but **not** in D's first layer. BN helps G converge. In D's first layer, batch statistics across real and fake can leak information and make training unstable.
3. **LeakyReLU in D** (slope 0.2), **ReLU in G**. The asymmetry exists because D needs gradient signal even for negative pre-activations (LeakyReLU has it), while G can use plain ReLU.
4. **Tanh activation on G's final layer** so output is in $[-1, 1]$. Match this with normalizing real images to $[-1, 1]$.
5. **Adam optimizer**, $\text{lr} = 2 \times 10^{-4}$, $\beta_1 = 0.5$.

A minimal DCGAN generator for 64×64 images:

```python
class DCGenerator(nn.Module):
    def __init__(self, z_dim=100, ngf=64):
        super().__init__()
        self.net = nn.Sequential(
            # input: (z_dim, 1, 1)
            nn.ConvTranspose2d(z_dim, ngf*8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf*8), nn.ReLU(True),                    # 4x4
            nn.ConvTranspose2d(ngf*8, ngf*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*4), nn.ReLU(True),                    # 8x8
            nn.ConvTranspose2d(ngf*4, ngf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*2), nn.ReLU(True),                    # 16x16
            nn.ConvTranspose2d(ngf*2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf), nn.ReLU(True),                      # 32x32
            nn.ConvTranspose2d(ngf, 3, 4, 2, 1, bias=False),
            nn.Tanh()                                                 # 64x64
        )
    def forward(self, z):
        return self.net(z.view(z.size(0), -1, 1, 1))
```

The Discriminator is the mirror: strided conv layers that go from 64×64 down to a single number.

**What DCGAN got right** is the *pattern*: progressively double resolution while halving channel count. Most GAN architectures since then are variations on this pattern.

## 3.2 LAPGAN and Progressive GAN — train low, grow up (2015, 2017)

DCGAN works for 64×64. It struggles at 256×256 and breaks at 1024×1024. Why? Two reasons:
1. Higher-resolution images have way more pixels for D to scrutinize. D can spot subtle high-frequency artifacts that G has no idea how to fix.
2. The Generator has to learn coarse structure (face shape) and fine detail (eyelashes) at the same time, with the same gradient signal.

**LAPGAN** (Denton et al., 2015) and **Progressive GAN** (Karras et al., 2017, sometimes called ProGAN) both solve this with the same idea: **start small, then add resolution.**

ProGAN trains G and D first at 4×4. They learn coarse face shape. Then 8×8, then 16×16, then 32×32, all the way up to 1024×1024. New layers are *faded in* smoothly — for a few thousand iterations, the new high-resolution output is mixed with the upsampled low-resolution output, weight gradually shifting from low to high.

Why it works: by the time G is trying to learn 1024×1024 details, it has *already* learned to produce plausible 512×512 images. The new layers only need to fill in finer detail, not relearn the whole thing.

ProGAN was the first to produce truly high-resolution photorealistic faces. Set the stage for StyleGAN.

## 3.3 Self-Attention GAN — SAGAN (2018)

Convolutions are *local*. A 3×3 kernel only sees a 3×3 neighborhood. Stacking many convs lets the network see further, but it is still expensive to capture long-range relationships ("the eyes should match each other" — eyes are on opposite sides of a face).

**Self-attention** (the same operation that powers Transformers) gives every pixel a way to look at every other pixel directly.

In a self-attention block, you compute three tensors from the input feature map $x$:

$$Q = W_Q x, \quad K = W_K x, \quad V = W_V x$$

then

$$\text{attention} = \text{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V$$

**Notation.**

| Symbol | Read it as | What it means |
|---|---|---|
| $x$ | "x" | The input feature map. |
| $W_Q, W_K, W_V$ | "W sub Q, W sub K, W sub V" | Learnable weight matrices that project $x$ into three roles. |
| $Q$ | "Q" or "query" | Query — what each pixel is looking for. |
| $K$ | "K" or "key" | Key — what each pixel contains. |
| $V$ | "V" or "value" | Value — what each pixel contributes if it gets attended to. |
| $K^\top$ | "K transpose" | The key matrix flipped on its side, so we can multiply with $Q$. |
| $Q K^\top$ | "Q times K transpose" | A score matrix: how well every query matches every key. |
| $\sqrt{d_k}$ | "square root of d sub k" | A normalizing factor. $d_k$ is the size of each key vector. |
| $\text{softmax}$ | "softmax" | Turns a row of raw scores into probabilities that sum to 1. |

Don't worry if you have not seen attention before — Module 1 of the LLM Handbook walks through it. The high-level point is: attention lets the model write "the pixel at position A depends on the pixel at position B" without going through a long chain of conv layers.

SAGAN added one self-attention layer at 32×32 in both G and D and saw a clear improvement in image quality, especially for objects with structure (animals, vehicles). It also introduced **spectral normalization in G**, not just in D — which became a quiet standard.

## 3.4 BigGAN — scale everything (2018)

If SAGAN said "add attention," BigGAN said "make it bigger." Brock et al. trained at:
- 4× larger batch size (2048 vs 256 typical at the time).
- 50% more parameters per layer.
- 512×512 resolution.

Combined with:
- **Class-conditional batch norm** for ImageNet classes.
- **Hierarchical noise injection** — different parts of $z$ go to different layers.
- The **truncation trick** — at inference, sample $z$ from a truncated normal (clip extreme values). Smaller truncation → less diverse but higher quality outputs. A direct knob trading variety for fidelity.

BigGAN was the first to produce convincing ImageNet samples at 512×512. The headline result: training scale alone, with a careful architecture, made a huge difference.

## 3.5 The StyleGAN family — the most influential modern GAN

NVIDIA's StyleGAN line is the most cited GAN architecture today. We will walk through the four main versions.

### StyleGAN (2018)

The key idea: **don't feed the noise vector to the first layer.** Instead, transform it into a "style vector" $w$ that controls each layer separately through Adaptive Instance Normalization (AdaIN).

Architecture:
1. Map $z$ (random noise) through an MLP to get $w$ (the "style space"). 8 layers.
2. The Generator starts from a learned constant (always the same), not from $z$.
3. At every layer, $w$ is broadcast in to modulate features via AdaIN:

$$\text{AdaIN}(x, w) = \gamma(w) \cdot \frac{x - \mu(x)}{\sigma(x)} + \beta(w)$$

**Notation.**

| Symbol | Read it as | What it means |
|---|---|---|
| $x$ | "x" | The feature map at some layer. |
| $w$ | "w" | The style vector. |
| $\mu(x)$ | "mu of x" | Mean (average) of the feature map. ($\mu$ — Greek "mu", rhymes with "few".) |
| $\sigma(x)$ | "sigma of x" | Standard deviation of the feature map. ($\sigma$ — Greek "sigma".) |
| $\gamma(w)$ | "gamma of w" | A scale factor predicted from the style vector. ($\gamma$ — Greek "gamma".) |
| $\beta(w)$ | "beta of w" | A shift (bias) predicted from the style vector. ($\beta$ — Greek "beta".) |

In words: subtract the mean, divide by the standard deviation (so the feature map has mean 0 and std 1), then re-scale and shift using values that come from the style vector $w$.

The result: $w$ controls "style" — color palette, pose, hair length, glasses. Different layers control different *levels of style*: early layers control coarse features (pose, face shape); middle layers control hair and facial structure; late layers control fine details (color of skin tone, lighting).

4. **Inject noise per layer** (separate from $w$). Adds local stochastic variation — different hair strands, different freckle patterns — without changing the high-level identity.

This decoupling gave us an **editable latent space** for the first time. You could find the $w$ vector of a real face (by inversion — Module 6), then interpolate to add a smile or change age.

### StyleGAN2 (2019)

StyleGAN had visible "blob" and "droplet" artifacts. StyleGAN2 fixed them by:

- Replacing AdaIN with **weight demodulation** (apply the style by scaling the conv weights directly, then normalize).
- Removing progressive growing (turned out to cause "phase artifacts" in the textures).
- Adding **path length regularization** in G — keeps the mapping from $w$ to images smooth.
- Switching to a simple **R1 regularization** on D (a single-term gradient penalty applied to real images only).

StyleGAN2 was the first to produce 1024×1024 faces with essentially no visible artifacts.

### StyleGAN2-ADA (2020)

GANs need a lot of data — typically 100K+ images. ADA (Adaptive Discriminator Augmentation) makes them work with thousands of images instead.

The trick: apply data augmentations (flips, crops, color jitter) to **both real and fake** images before showing them to D. As long as both batches see the same augmentations, the underlying game is unchanged. But D no longer overfits to memorized real images.

The "adaptive" part: turn augmentation strength up or down based on a real-time signal of how much D is overfitting. Train on 1,000 images instead of 70,000 and still get sharp results.

### StyleGAN3 (2021)

StyleGAN2 had a subtle issue: details (hair strands, freckles) were "stuck to pixel coordinates" rather than moving smoothly with the rest of the face. If you slid the face around its latent space, textures would jitter unnaturally.

StyleGAN3 fixed this with a careful redesign of the upsampling and filtering. The result is "equivariant" — translation and rotation in the latent space produce translation and rotation in the image, without texture sticking.

This made video synthesis with StyleGAN much better. If you want to animate, use StyleGAN3.

### StyleGAN-T (2023) and GigaGAN (2023)

These are attempts to scale GANs back up to compete with diffusion on **text-to-image** at 1B+ parameters and billions of training images.

- **StyleGAN-T** keeps the style-based decoder but adds a text encoder (CLIP). Faster than diffusion at inference, competitive quality on simple prompts but still behind on complex compositions.
- **GigaGAN** (Adobe) is even larger — 1B parameters of generator — with multi-scale conditioning. Showed that GANs can produce text-to-image at high quality with one forward pass, hundreds of times faster than diffusion.

Neither has replaced diffusion at the high end, but they proved single-step generation is still alive.

## 3.6 What happens when you modify G or D?

This is the section many students ask about. GAN papers feel like a stack of small tweaks. What is the effect of each one?

### 3.6.1 Capacity balance — why G and D must be matched

A GAN is a game. If one player is much stronger than the other, the game breaks.

- **D too strong.** $D(\text{real}) \approx 1$ and $D(\text{fake}) \approx 0$ within a few epochs. G's gradient signal vanishes (Module 1.5.2). G never improves.
- **D too weak.** $D \approx 0.5$ for everything. G is "fooling" a D that has no idea what real looks like. G learns garbage.

How to balance:

- Match the depth and width of D to G.
- Use **TTUR** — different learning rates per network. The classic trick is $\text{lr}_D = 4\text{lr}_G$ (D gets a higher LR because its job is easier and benefits from speed). Used in many modern GANs.
- Use **n_critic** — train D more often. WGAN typically does 5 critic updates per G update.
- If D is winning, add noise to its inputs ("instance noise") or use augmentations (ADA).
- If G is winning, *shrink* G or freeze its weights briefly while D catches up.

### 3.6.2 What people commonly change, and what it does

Here is a non-exhaustive practical table. Use it when you read papers or modify your own model.

| Modification | Effect |
|---|---|
| **More depth (more layers)** | More capacity → can model more complex distributions. Risk: vanishing gradients deep in G or D; needs skip connections or normalization. |
| **More width (more channels)** | Like depth, but cheaper to scale in practice. BigGAN's main lever. |
| **BatchNorm in G** | Smooths training, faster convergence. Standard for DCGAN-style G. |
| **BatchNorm in D** | Mixes real and fake batch statistics — bad. Almost always avoided in D. |
| **InstanceNorm** | Per-sample normalization. Useful in style transfer and Pix2Pix; less standard in G. |
| **LayerNorm** | Doesn't mix samples; safe in D. Less common in image GANs. |
| **Spectral Norm in D** | Lipschitz constraint → stable training, especially with hinge or WGAN loss. **One of the highest-impact additions you can make.** |
| **Spectral Norm in G** | Also helps (SAGAN onward). Less critical than in D. |
| **ReLU → LeakyReLU in D** | Avoids "dead neurons" early in training when many activations are negative. Slope 0.2 is standard. |
| **GELU / SiLU** | Smoother gradients than ReLU. Modern preference in transformers; sometimes helps in GANs. |
| **Self-attention** | Lets distant pixels coordinate. Cost: $O(n^2)$ in spatial size. Useful at lower resolutions (32×32 feature maps). |
| **Skip connections in G** | Lets early layers contribute to final output. Helps gradient flow. Used in StyleGAN. |
| **Multi-scale D (PatchGAN)** | D scores image patches at multiple resolutions. Forces realism at every scale. Used by Pix2Pix, CycleGAN. |
| **U-Net D** (StyleGAN2 variant) | D outputs *per-pixel* real/fake scores using a U-Net. Richer gradient. |
| **Progressive growing** | Train small first, then add resolution. Helped before StyleGAN2 figured out R1 reg. |
| **Style-based input (AdaIN, modulation)** | Decouples "what is generated" from "where it goes" in the network. Enables editable latent space. |
| **Truncation trick** | Sample $z$ from a clipped distribution. Smaller clip → higher quality but lower diversity. A direct fidelity/diversity knob. |
| **EMA of G weights** | Use an exponential moving average of G's weights at inference. Smooths out training noise. **Always do this.** |

### 3.6.3 Heuristics — the safe defaults for 2026

If you start a new GAN project today, do this:

1. Use a DCGAN-style backbone if you want simple. Use StyleGAN2 or 3 if you want quality and have time to set it up.
2. **Spectral norm in D, always.** Add to G too if it helps.
3. **LeakyReLU(0.2) in D, ReLU or GELU in G.**
4. **Hinge loss + non-saturating G** unless you have a specific reason to use WGAN-GP.
5. **Adam, $\beta_1 = 0.5, \beta_2 = 0.999$.** TTUR: $\text{lr}_D = 4\text{lr}_G$, $\text{lr}_G \approx 1\text{e}{-4}$.
6. **EMA the G at inference.** Decay 0.999 or 0.9999.
7. If your dataset is small (<10K), use **ADA**.

These are the defaults that almost always work. Tune from here.

## Key papers

- Radford et al., *Unsupervised Representation Learning with DCGANs*, 2015.
- Karras et al., *Progressive Growing of GANs*, ICLR 2018.
- Zhang et al., *Self-Attention Generative Adversarial Networks (SAGAN)*, ICML 2019.
- Brock et al., *Large Scale GAN Training (BigGAN)*, ICLR 2019.
- Karras et al., *A Style-Based Generator Architecture for Generative Adversarial Networks (StyleGAN)*, CVPR 2019.
- Karras et al., *Analyzing and Improving the Image Quality of StyleGAN (StyleGAN2)*, CVPR 2020.
- Karras et al., *Training Generative Adversarial Networks with Limited Data (StyleGAN2-ADA)*, NeurIPS 2020.
- Karras et al., *Alias-Free Generative Adversarial Networks (StyleGAN3)*, NeurIPS 2021.
- Kang et al., *Scaling up GANs for Text-to-Image Synthesis (GigaGAN)*, CVPR 2023.

## Exercises

1. Take a working DCGAN. Swap LeakyReLU(0.2) in D for ReLU. Re-train on CIFAR-10. What changes?
2. Add spectral normalization to D only. Compare FID over training to the no-SN baseline.
3. Implement the truncation trick. Sweep $\psi$ from 0.3 to 1.0 and plot the FID and a sample grid for each value. Find the trade-off.
4. Find StyleGAN2-ADA's official PyTorch repo on GitHub. Run inference on a pretrained checkpoint. Then read the `train.py` and identify each of the additions from section 3.6.2 in the code.
