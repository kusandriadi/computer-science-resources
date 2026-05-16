# Module 2 — Losses

The original GAN loss has known problems. Almost every well-known GAN since 2016 has its own loss function. This module explains why and walks through the famous ones.

## Learning goals

By the end of this module you can:

- Explain the difference between a loss function and an objective function.
- Explain why vanilla GAN loss can vanish.
- Read and implement: non-saturating loss, LSGAN, WGAN, WGAN-GP, SN-GAN, hinge, relativistic.
- Pick a loss for your project based on what is known to work.

## 2.1 Loss vs objective function — are they the same?

Short answer: **almost, but not exactly**. People often use these words interchangeably. Strictly, there is a hierarchy.

| Term | What it means |
|---|---|
| **Objective function** | The general thing you are optimizing. Could be a *minimum*, a *maximum*, a *min-max game*, or something more exotic. The umbrella term. |
| **Loss function** | A specific kind of objective: a number that measures "how wrong" the model is, and that you *minimize*. Usually $\ge 0$, with 0 meaning "perfectly correct." |
| **Cost function** | Sometimes a synonym for loss. Sometimes refers to loss averaged over a dataset (so "cost" = mean of per-example "loss"). Don't worry about it — used inconsistently. |

In GAN literature you will see both:

- **"GAN objective"** — the min-max equation from Module 1. This is correct usage, because the whole game is not a pure minimization.
- **"Generator loss"** and **"Discriminator loss"** — also correct. Each network *individually* minimizes its own loss. It is just that G's loss and D's loss point in opposite directions, which is what makes the whole thing adversarial.

A useful rule:

> When talking about the *whole GAN system*, say "objective." When talking about *one network's training step*, say "loss."

In the rest of this module we use "loss" because we are looking at what each network minimizes.

## 2.2 The original loss and why it has problems

Recall from Module 1:

$$L_D = -\mathbb{E}_x[\log D(x)] - \mathbb{E}_z[\log(1 - D(G(z)))]$$

$$L_G^{\text{saturating}} = \mathbb{E}_z[\log(1 - D(G(z)))]$$

**Notation refresher.**

- $\mathbb{E}_x[\,\cdot\,]$ = average of $\cdot$ over real samples $x$.
- $\mathbb{E}_z[\,\cdot\,]$ = average of $\cdot$ over noise samples $z$.
- $D(x)$ = D's probability that $x$ is real.
- $G(z)$ = a fake image.

The problem with $L_G^{\text{saturating}}$: when D is strongly winning, $D(G(z)) \approx 0$, so $\log(1 - 0) = \log 1 = 0$. Its derivative with respect to G's parameters is also basically 0. G learns nothing.

**The non-saturating fix.** Goodfellow's same 2014 paper proposes:

$$L_G^{\text{non-saturating}} = -\mathbb{E}_z[\log D(G(z))]$$

Now when $D(G(z)) \approx 0$, $-\log D(G(z))$ is *huge*, and so is its gradient. G learns aggressively even when losing badly.

This is not a different math game — it is the same game with a different scaling of the gradient. It is a *heuristic*. Almost every GAN implementation uses the non-saturating form by default.

## 2.3 LSGAN — Least Squares GAN (2017)

**Idea.** Replace the binary cross-entropy with a mean squared error. D still tries to output 1 for real and 0 for fake, but uses a continuous "regression" loss.

$$L_D^{\text{LS}} = \tfrac{1}{2}\mathbb{E}_x[(D(x) - 1)^2] + \tfrac{1}{2}\mathbb{E}_z[(D(G(z)))^2]$$

$$L_G^{\text{LS}} = \tfrac{1}{2}\mathbb{E}_z[(D(G(z)) - 1)^2]$$

**Notation.** $(D(x) - 1)^2$ is the squared error between D's output and the target value 1. Big when D is wrong, small when right. Same for $(D(G(z)))^2$ vs target 0.

**Why it helps.** The original BCE gradient flattens near the decision boundary (because of the sigmoid). MSE gradient stays strong even when D is confident, so it pulls G harder. In practice LSGAN trains more stably than vanilla and produces slightly sharper images.

**Pros:** simple swap, more stable, no extra constraints.
**Cons:** still vulnerable to mode collapse, no theoretical guarantees of any nice divergence.

## 2.4 WGAN — Wasserstein GAN (2017)

This was the conceptual leap. Arjovsky et al. observed that the Jensen-Shannon divergence implicit in the original GAN is *discontinuous* when $p_G$ and $p_{\text{data}}$ have non-overlapping support. That is technical talk for: "if G's images are nowhere near real images, the gradient signal collapses."

They proposed a different distance: the **Wasserstein-1 distance** (also called "Earth Mover's Distance"). Intuition: imagine each distribution is a pile of dirt. Wasserstein distance is the *least work* you need to move one pile to look like the other. It is well-defined even when the distributions do not overlap, and it changes smoothly as G's weights change.

The formal expression uses the Kantorovich-Rubinstein duality:

$$W(p_{\text{data}}, p_G) = \sup_{\|f\|_L \le 1} \; \mathbb{E}_{x \sim p_{\text{data}}}[f(x)] - \mathbb{E}_{x \sim p_G}[f(x)]$$

**Notation.**

- $\sup$ = "supremum" — basically *max* over functions $f$.
- $f$ = any function from images to real numbers. WGAN trains a neural network to play this role. We rename it from $D$ to **$f$** or **the critic**, because it no longer outputs probabilities.
- $\|f\|_L \le 1$ = "$f$ is 1-Lipschitz." This is a smoothness condition: $f$ cannot change too fast as its input changes. Formally, $|f(x_1) - f(x_2)| \le \|x_1 - x_2\|$.

**Why the critic is "1-Lipschitz."** Without this constraint, $f$ could just send real points to $+\infty$ and fakes to $-\infty$, and the gap would be infinite. The Lipschitz constraint forces $f$ to be smooth, which makes the optimization well-posed.

**WGAN losses.**

$$L_f = -\big(\mathbb{E}_x[f(x)] - \mathbb{E}_z[f(G(z))]\big)$$

$$L_G = -\mathbb{E}_z[f(G(z))]$$

Notice: no logarithms, no sigmoid in the critic. The output of $f$ is a raw real number, not a probability.

**Enforcing the Lipschitz constraint — the WGAN way: weight clipping.** After each gradient step on $f$, clip every weight to a small range like $[-0.01, 0.01]$. This is a crude way to keep the function smooth.

```python
# WGAN training step (simplified)
for _ in range(n_critic):                # update critic 5x for every G step
    z = torch.randn(B, z_dim, device=device)
    fake = G(z).detach()
    loss_f = -(f(real).mean() - f(fake).mean())
    opt_f.zero_grad(); loss_f.backward(); opt_f.step()
    for p in f.parameters():
        p.data.clamp_(-0.01, 0.01)        # weight clipping

z = torch.randn(B, z_dim, device=device)
loss_g = -f(G(z)).mean()
opt_g.zero_grad(); loss_g.backward(); opt_g.step()
```

**Pros:**
- Loss correlates with sample quality. Lower critic loss = better samples. This is huge — finally a usable "validation curve."
- Much more stable than vanilla GAN. Mode collapse rarer.

**Cons of weight clipping:**
- Crude. Limits the critic's capacity.
- Hyperparameter sensitive (the clip range matters a lot).

These cons led to the next paper.

## 2.5 WGAN-GP — Wasserstein GAN with Gradient Penalty (2017)

Same WGAN game, but enforce the Lipschitz constraint with a smoother trick: penalize the critic's gradients with respect to its inputs.

A function is 1-Lipschitz exactly when its gradient norm is everywhere $\le 1$. So we add a penalty term that pulls $\|\nabla_x f(x)\|$ toward 1.

$$L_f^{\text{GP}} = \mathbb{E}_z[f(G(z))] - \mathbb{E}_x[f(x)] + \lambda \, \mathbb{E}_{\hat{x}}\big[(\|\nabla_{\hat{x}} f(\hat{x})\|_2 - 1)^2\big]$$

**Notation.**

- $\hat{x}$ = a point sampled on a random line between a real and a fake. Specifically $\hat{x} = \epsilon x + (1 - \epsilon) G(z)$ for $\epsilon \sim U[0, 1]$.
- $\nabla_{\hat{x}} f(\hat{x})$ = the gradient of the critic's output with respect to its input.
- $\|\cdot\|_2$ = Euclidean norm.
- $\lambda$ = penalty weight, usually 10.

**Why points on a line?** Theory says the constraint matters along the "transport path" between real and fake distributions. Sampling on lines between real and fake samples is a practical approximation.

**Code skeleton:**

```python
alpha = torch.rand(B, 1, 1, 1, device=device)
x_hat = alpha * real + (1 - alpha) * fake
x_hat.requires_grad_(True)

d_hat = f(x_hat)
grads = torch.autograd.grad(d_hat.sum(), x_hat, create_graph=True)[0]
gp = ((grads.view(B, -1).norm(2, dim=1) - 1) ** 2).mean()

loss_f = f(fake).mean() - f(real).mean() + 10 * gp
```

**Pros:** removes weight clipping. Stable enough that it became the default for many years. Loss tracks quality.
**Cons:** slower per step (each critic update needs an extra backward pass for the gradient penalty).

## 2.6 SN-GAN — Spectral Normalization (2018)

Another way to enforce the Lipschitz constraint, even cheaper. The Lipschitz constant of a layer with weight matrix $W$ and activation that does not increase Lipschitz constant (like LeakyReLU) is bounded by the largest singular value of $W$ (also called its **spectral norm**, written $\sigma(W)$).

**Idea.** Divide every weight matrix by its spectral norm, so that $W / \sigma(W)$ has spectral norm 1. Layer-by-layer, the Lipschitz constant of the whole network is then at most 1.

In practice you estimate $\sigma(W)$ with one step of power iteration per training step — that is *fast*, just a couple of matrix-vector multiplies.

PyTorch has it built in:

```python
from torch.nn.utils import spectral_norm

D = nn.Sequential(
    spectral_norm(nn.Conv2d(3, 64, 4, 2, 1)),
    nn.LeakyReLU(0.2),
    spectral_norm(nn.Conv2d(64, 128, 4, 2, 1)),
    ...
)
```

That is it. You can pair spectral norm with any loss (BCE, hinge, WGAN). It became the default building block.

**Pros:** cheap, robust, plug-and-play.
**Cons:** can be conservative (sometimes constrains too much).

## 2.7 Hinge loss (2018)

Used by SAGAN, BigGAN, StyleGAN3, and many modern GANs. Closely paired with spectral norm.

$$L_D^{\text{hinge}} = \mathbb{E}_x[\max(0, 1 - D(x))] + \mathbb{E}_z[\max(0, 1 + D(G(z)))]$$

$$L_G^{\text{hinge}} = -\mathbb{E}_z[D(G(z))]$$

**Reading the equations.**

- $\max(0, 1 - D(x))$: 0 when $D(x) \ge 1$ (D is confident enough that real is real); positive otherwise. We only penalize D when its margin is too small.
- $\max(0, 1 + D(G(z)))$: 0 when $D(G(z)) \le -1$ (D is confident the fake is fake); positive otherwise.
- G just wants to push $D(G(z))$ as high as possible.

**Why it works well.** No saturating logs, no Lipschitz constraint built in (you usually add spectral norm), and gradients only flow when needed. Combined with SN, hinge loss is the modern default — most "state of the art" GAN papers from 2018 onward use it.

## 2.8 Relativistic GAN (2018)

**Idea.** Instead of asking "is this image real?", ask "is this image *more* real than that one?" The Discriminator compares pairs.

Relativistic average loss:

$$L_D^{\text{Ra}} = -\mathbb{E}_x[\log \tilde{D}(x_r, x_f)] - \mathbb{E}_z[\log(1 - \tilde{D}(x_f, x_r))]$$

where $\tilde{D}(a, b) = \sigma(D(a) - \mathbb{E}[D(b)])$.

**Notation.**

- $x_r$ = real sample. $x_f$ = fake sample.
- $\sigma$ = sigmoid.
- $\mathbb{E}[D(b)]$ = average D output over a batch of $b$'s. The "comparison reference."

**Why it helps.** During training, G should know not just "you need to look real" but "you need to look *more* real than the current fakes." This pushes G to consistently improve relative to its own current quality, and prevents D from getting stuck at $D \approx 1$ for everything.

Used by ESRGAN (Module 6 will return to this).

## 2.9 f-GAN — generalizing all of the above (2016)

Almost every GAN loss is a special case of one general framework: f-divergences. The f-GAN paper showed that you can pick any well-behaved $f$ function (KL, JS, Pearson $\chi^2$, etc.) and derive a corresponding GAN training objective.

You will not need this for most practical work. But it is good to know that:

- Vanilla GAN ↔ Jensen-Shannon divergence
- LSGAN ↔ Pearson $\chi^2$ divergence
- WGAN ↔ Wasserstein-1 distance (a metric, *not* an f-divergence; this is special)

Each one comes with its own gradient behavior, which is why no single loss is "the best" for every dataset.

## 2.10 Which loss should I actually use?

A practical 2026 cheat sheet:

| Use case | Recommendation |
|---|---|
| Toy / learning | Non-saturating BCE. Simple, predictable. |
| Image generation, small dataset | **SN + Hinge.** Robust, well-studied. |
| Image generation, large model | **SN + Hinge** or **R1 regularization** (a simpler GP variant used by StyleGAN). |
| Super-resolution | **Relativistic + perceptual loss** (ESRGAN-style; see Module 6). |
| Theoretical work / research | WGAN-GP for "loss = quality" interpretability. |
| You want maximum stability and don't care about speed | WGAN-GP. |

If you remember nothing else: **spectral norm in D + hinge loss + non-saturating G** is the safe modern default.

## Key papers

- Goodfellow, *Generative Adversarial Nets*, 2014 — original loss.
- Mao et al., *Least Squares Generative Adversarial Networks*, 2017 — LSGAN.
- Arjovsky et al., *Wasserstein GAN*, 2017 — WGAN.
- Gulrajani et al., *Improved Training of Wasserstein GANs*, 2017 — WGAN-GP.
- Miyato et al., *Spectral Normalization for Generative Adversarial Networks*, 2018 — SN-GAN.
- Lim & Ye, *Geometric GAN*, 2017 — hinge loss for GANs.
- Jolicoeur-Martineau, *The relativistic discriminator: a key element missing from standard GAN*, 2018.

## Exercises

1. Train the same DCGAN on CIFAR-10 with three different losses (non-saturating BCE, hinge, WGAN-GP). Plot FID over training. Compare.
2. Implement spectral normalization from scratch (one power iteration), then verify your version against `torch.nn.utils.spectral_norm`.
3. Read the WGAN paper, sections 1–3. Write a one-paragraph plain-English summary of "why Jensen-Shannon is bad and Wasserstein is good."
4. Reproduce the gradient vanishing problem: train vanilla GAN with the saturating loss on MNIST. Plot $D(\text{fake})$ and $\|\nabla_\theta L_G\|$ over time.
