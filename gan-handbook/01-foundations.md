# Module 1 — Foundations

This is the core module. Everything else builds on this. We will:

1. Define the Generator and the Discriminator.
2. Walk through the adversarial game equation symbol by symbol.
3. Look at the training loop in code.
4. Cover what goes wrong (mode collapse, vanishing gradients, non-convergence) and how to diagnose it.

## Learning goals

By the end of this module you can:

- Explain in plain English what a Generator and a Discriminator do.
- Read the original GAN minimax equation and say what each symbol means.
- Implement a vanilla GAN training step in 30 lines of PyTorch.
- Recognize mode collapse, vanishing gradients, and non-convergence from training curves.

## 1.1 The two networks

A GAN is two neural networks that learn together.

**The Generator (G)** takes random noise and turns it into a fake sample. Its input is a vector of random numbers — usually 100 or 512 of them — drawn from a standard normal distribution. We call this noise $z$. Its output is whatever data type you are trying to generate: an image, a sound clip, a 3D mesh. For images, $G(z)$ is a tensor of shape `[3, H, W]` (channels, height, width).

You can think of the noise vector as a "creative seed." Different seeds produce different outputs. If $z$ were the same every time, $G$ would only ever produce one image. The randomness in $z$ is what gives the Generator variety.

**The Discriminator (D)** takes a sample and outputs a single number between 0 and 1. That number is its estimate of how likely the sample is to be real. So $D(\text{real image}) \approx 1$ and $D(\text{fake image}) \approx 0$ is what we hope to see at the end of training.

D is a normal classifier. It takes an image, runs it through some conv layers, and outputs a probability. The only twist is that the "labels" come from the GAN structure: anything from the real dataset is class 1, anything from G is class 0.

Here is a tiny version of each:

```python
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, z_dim=100, img_dim=28*28):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(z_dim, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim),
            nn.Tanh(),                  # outputs in [-1, 1]
        )

    def forward(self, z):
        return self.net(z)


class Discriminator(nn.Module):
    def __init__(self, img_dim=28*28):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(img_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid(),               # output in [0, 1]
        )

    def forward(self, x):
        return self.net(x)
```

That is it. Two small MLPs. For real datasets you would replace these with conv nets (Module 3), but the idea is the same.

## 1.2 The adversarial game

Here is the original GAN objective from Goodfellow's 2014 paper:

$$\min_G \max_D \; V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z(z)}[\log(1 - D(G(z)))]$$

Time to unpack it. Read this slowly.

**The big picture.** $V(D, G)$ is a number that measures "how well D is doing." D wants $V$ to be **high** (it is good at telling real from fake). G wants $V$ to be **low** (it is fooling D). The notation $\min_G \max_D$ means "G plays a minimization game, D plays a maximization game, both against $V$."

**Each symbol explained.** (Pronunciation guide for unfamiliar symbols is in `00-overview.md`.)

| Symbol | Read it as | What it means |
|---|---|---|
| $V(D, G)$ | "V of D, G" | The "value function." A single number that depends on both networks' current weights. |
| $\min_G$ | "min G" | "Pick G's weights to make this number small." |
| $\max_D$ | "max D" | "Pick D's weights to make this number large." |
| $\mathbb{E}_{x \sim p_{\text{data}}}[\,\cdot\,]$ | "expected value of dot, when x is drawn from p-data" | The average of $\cdot$ over the real data distribution. $\mathbb{E}$ is just "E for expected value." |
| $p_{\text{data}}$ | "p data" | The (unknown) distribution that real images come from. We approximate it by sampling from our training set. |
| $x$ | "x" | A real image from the dataset. |
| $D(x)$ | "D of x" | The Discriminator's probability that $x$ is real. A number in $(0, 1)$. |
| $\log D(x)$ | "log D of x" | The natural log of D's output. Close to 0 when $D(x) \approx 1$ (good); very negative when $D(x) \approx 0$ (bad). |
| $\mathbb{E}_{z \sim p_z(z)}[\,\cdot\,]$ | "expected value of dot, when z is drawn from p-z" | Average over random noise samples. |
| $p_z$ | "p sub z" or just "p-z" | The noise distribution we sample from. Usually $\mathcal{N}(0, I)$ — a standard normal. |
| $z$ | "z" | A noise vector. |
| $G(z)$ | "G of z" | A fake image generated from noise $z$. |
| $D(G(z))$ | "D of G of z" | What D thinks of the fake. |
| $1 - D(G(z))$ | "one minus D of G of z" | Probability that the fake is fake. |
| $\log(1 - D(G(z)))$ | "log of one minus D of G of z" | Close to 0 when D is correctly suspicious of the fake; very negative when G fools D. |
| $\sim$ | "tilde" or "distributed as" | "Drawn from" — random variable on the left is sampled from the distribution on the right. |
| $\mathcal{N}(0, I)$ | "normal zero, identity" | The standard normal distribution. Mean 0, covariance the identity matrix. |

**Plain English version:**

> "Pick G to minimize, and D to maximize, the following: the average log-probability D assigns to real samples being real, plus the average log-probability D assigns to fake samples being fake."

**D's view** (it wants the sum large):
- It wants $D(x) \approx 1$ for real $x$, which makes $\log D(x) \approx 0$ (the highest log can go without exceeding 1).
- It wants $D(G(z)) \approx 0$ for fakes, which makes $\log(1 - D(G(z))) \approx 0$.
- A perfect D pushes both terms up to 0.

**G's view** (it wants the sum small):
- G has no control over the first term — that is only about real data.
- G wants $D(G(z)) \approx 1$, which makes $\log(1 - D(G(z)))$ very negative.
- The more G fools D, the more negative the objective.

## 1.3 The training loop

In practice, we cannot literally compute $\min \max$. We alternate: one step of gradient descent for D, then one step for G. Both have their own loss (we will use the word "loss" here to match the code; we will sort out loss vs. objective in Module 2).

**D's loss** (it wants this small — we just flip the sign of D's part of $V$):

$$L_D = -\big(\mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z}[\log(1 - D(G(z)))]\big)$$

In code, this is just binary cross-entropy: real images get label 1, fake images get label 0.

**G's loss** (it wants D to think the fakes are real):

$$L_G = \mathbb{E}_z[\log(1 - D(G(z)))]$$

In practice, we use a small trick called the **non-saturating loss**, because the original $\log(1 - D(G(z)))$ gives almost no gradient when D is too good (more on this in Module 2). The non-saturating version is:

$$L_G^{\text{non-saturating}} = -\mathbb{E}_z[\log D(G(z))]$$

This is *not* mathematically identical to the original. It is a heuristic that gives better gradients early in training. Almost all real GAN implementations use it.

**One training step in PyTorch:**

```python
# Discriminator step
real_imgs = next(iter(loader)).to(device)
z = torch.randn(batch_size, z_dim, device=device)
fake_imgs = G(z).detach()                       # detach so G's grads don't flow

d_real = D(real_imgs)
d_fake = D(fake_imgs)
loss_d = -torch.log(d_real + 1e-8).mean() \
       - torch.log(1 - d_fake + 1e-8).mean()    # BCE in two parts

opt_D.zero_grad()
loss_d.backward()
opt_D.step()

# Generator step
z = torch.randn(batch_size, z_dim, device=device)
fake_imgs = G(z)
d_fake = D(fake_imgs)
loss_g = -torch.log(d_fake + 1e-8).mean()       # non-saturating

opt_G.zero_grad()
loss_g.backward()
opt_G.step()
```

A few practical notes:

- We add `1e-8` inside `log` to avoid `log(0)`.
- We `.detach()` the fakes when training D so gradients do not flow into G during D's step.
- We re-sample fresh noise for the G step, which prevents D from memorizing G's exact output.
- In Module 8 we wire this into a full runnable trainer.

## 1.4 Why the math works (intuition only)

The original paper proves that if D is "optimal" at every step (truly the best classifier between real and current fake distribution), then minimizing $V$ with respect to G is equivalent to minimizing the **Jensen-Shannon divergence** between $p_{\text{data}}$ and $p_G$ (the distribution of G's outputs).

You do not need to memorize this. The intuition is enough:

> A perfect Discriminator can be turned into a "distance meter" between the real data distribution and the generator's distribution. Training G to fool a perfect D = pulling $p_G$ toward $p_{\text{data}}$.

In practice D is never perfect, and that is where many of the problems below come from.

## 1.5 Things that go wrong

This section is the most important one in this module. GANs are famously unstable. If you have not seen one fail, you have not run one yet.

### 1.5.1 Mode collapse

**Symptom:** the Generator produces only a few similar images, no matter the input noise. You sample 100 different $z$ vectors and get 100 nearly identical outputs.

**Why it happens.** D and G are doing a step-by-step dance. G's job is to fool D. If G discovers one fake that fools D really well, the gradient signal pushes G to produce that fake more often. D will eventually notice and learn to reject that mode — but by then G has shifted to producing only *another* mode. G keeps hopping between a few modes that beat the current D, never spreading out to match the full data distribution.

More formally: the original GAN objective measures Jensen-Shannon divergence, but only between *fake* samples G actually produces and real data. There is no explicit penalty for missing whole regions of the real distribution.

**How to diagnose.** Plot a grid of samples from your G every few epochs. Are they diverse? Are you seeing all the classes in your dataset? If you trained on MNIST and your G only ever outputs 3's and 8's, that is mode collapse.

**Fixes** (covered in detail later):
- Use better losses (WGAN-GP, hinge — Module 2).
- Use spectral normalization in D (Module 2 and 3).
- Use mini-batch discrimination (D sees a batch at once, not just one image, and can detect "all the same").
- Use historical buffers (D sees old fakes, not just the newest ones).
- Use a bigger or more diverse dataset.

### 1.5.2 Vanishing gradients

**Symptom:** training stalls. Losses sit at the same value forever. G's outputs stop changing.

**Why it happens.** The original G loss is $\log(1 - D(G(z)))$. When D is very confident the fake is fake — $D(G(z)) \approx 0$ — the gradient of $\log(1 - 0) = 0$ is also basically 0. G learns nothing.

This is exactly why the non-saturating loss $-\log D(G(z))$ exists. When $D(G(z)) \approx 0$, $-\log D(G(z))$ is huge, and its gradient is huge — so G learns aggressively.

**How to diagnose.** Watch $D$'s output. If `D(fake)` is always near 0 in the first few thousand iterations, your G is getting no signal.

**Fixes:**
- Use the non-saturating G loss (most code defaults to this).
- Cap D's training: if D is winning too easily, do fewer D updates per G update.
- Switch to WGAN (Module 2), where this problem mostly goes away by construction.

### 1.5.3 D too strong, D too weak

**D too strong:** $D(\text{real}) \approx 1$ and $D(\text{fake}) \approx 0$ almost from the start. G never gets useful gradient. Often happens when D has way more capacity than G, or when learning rates are unbalanced.

**D too weak:** $D$ outputs around 0.5 for everything — it has not learned to distinguish anything. G learns garbage, because it is "fooling" a D that has no idea what real looks like.

**Fix:** balance the two. A common trick is **TTUR** (Two Time-scale Update Rule) — use a higher learning rate for D, e.g., $\text{lr}_D = 4 \times 10^{-4}$ vs $\text{lr}_G = 1 \times 10^{-4}$. This sounds backwards but works because D is doing a "simpler" job and benefits from a faster learning rate.

### 1.5.4 Non-convergence and oscillation

**Symptom:** loss curves bounce around forever, never settling. Sample quality goes up and down across epochs with no clear trend.

**Why it happens.** GANs do not have a single global loss being minimized. They are a game. Game equilibria can be unstable — a fixed point that is locally a saddle, not a local minimum. Standard gradient descent does not always converge to such points.

**How to diagnose.** Plot D and G losses over time. Mild oscillation is normal. If they oscillate with growing amplitude or if you see periodic spikes, you have a problem.

**Fixes:**
- WGAN-GP gives much smoother curves.
- Exponential Moving Average (EMA) of G's weights at inference time: average G's parameters over the last N steps and use the averaged G for sampling. Smooths out noise.
- Reduce learning rates.
- Use the Adam optimizer with $\beta_1 = 0.5$ rather than the default $0.9$. The default momentum can amplify oscillation in adversarial settings.

### 1.5.5 The "summary" symptom table

| Symptom | Most likely cause | First thing to try |
|---|---|---|
| Same image always | Mode collapse | WGAN-GP or spectral norm; check dataset diversity |
| Loss stuck, no progress | Vanishing gradient on G | Non-saturating loss; reduce D capacity |
| Loss bouncing wildly | Non-convergence | EMA of G; Adam $\beta_1 = 0.5$ |
| D loss → 0 immediately | D too strong | Smaller D, lower $\text{lr}_D$, more noise in real images |
| D loss ≈ ln(2) forever | D too weak | Bigger D, higher $\text{lr}_D$ |
| Blurry samples | Loss function picking averages | Switch to hinge loss or WGAN-GP |

## 1.6 What changes when you scale up

The toy MLPs above only work for tiny images (28×28 MNIST). For real photographs you need convolutional architectures (Module 3) and better losses (Module 2). But the structure stays the same:

1. Sample noise $z$.
2. Push through G.
3. D scores real and fake batches.
4. Update D, then G.

Everything else is "just" engineering.

## Key papers

- Goodfellow et al., *Generative Adversarial Nets*, NeurIPS 2014. The original. Read sections 1, 3, and 4. The math in section 4 is the "JS divergence" result above.
- Salimans et al., *Improved Techniques for Training GANs*, NeurIPS 2016. Where mini-batch discrimination, feature matching, and many heuristics were introduced.
- Arjovsky et al., *Towards Principled Methods for Training Generative Adversarial Networks*, ICLR 2017. Explains why vanilla GAN gradients vanish and motivates WGAN (Module 2).

## Exercises

1. **Implement vanilla GAN on MNIST** with the MLPs above. Run for 30 epochs. Save sample grids every 5 epochs. Identify which failure mode (if any) appears.
2. **Force mode collapse on purpose.** Set $\text{lr}_D$ to 10× $\text{lr}_G$ and watch what happens.
3. **Try both G losses** — the saturating $\log(1 - D(G(z)))$ and the non-saturating $-\log D(G(z))$. Plot $D(\text{fake})$ over time for each. Confirm the saturating loss kills gradients early.
4. **Read** the table in 1.5.5 and match each row to a real GAN failure you have read about in a blog post or paper.
