# Module 0 — Overview

## What this handbook is about

You have probably seen things like this on the internet:

- Websites that show fake human faces, each one created by a computer, all looking real ("This Person Does Not Exist").
- Photo enhancers that take a blurry image and turn it sharp.
- Tools that swap faces in videos, or turn a horse into a zebra in real time.
- The voice of a singer made to say things they never said.

Most of these are powered by a family of models called **GANs** — Generative Adversarial Networks. This handbook walks you from the original 2014 idea to the variants that power tools you actually use today (Real-ESRGAN, StyleGAN, CycleGAN, HiFi-GAN).

## Why GANs at all? Don't we already have neural networks?

Yes. So why did anyone invent a new thing in 2014?

Here is the gap. Neural networks before 2014 were great at one thing: **mapping inputs to labels**. Show an image, get a label ("cat"). Show a sentence, get a sentiment ("positive"). This is called **discriminative** modeling — you separate or classify what already exists.

But what if you do not want to label things — you want to **make** new things? You want a network that, given nothing, draws a cat. Or given the word "cat", paints a cat that has never existed before. That is called **generative** modeling, and it is harder for one clear reason: **there is no single right answer**. Many different images are all valid "cats." How does the network learn to produce something realistic when you cannot tell it "exactly this pixel goes here"?

Before GANs, the main options were:

1. **Autoregressive models** — generate the image one pixel at a time, predicting each pixel from the previous ones. Worked, but slow and the early ones produced blurry results.
2. **Variational Autoencoders (VAEs)** — train a network to compress an image into a small set of numbers, and a second network to decompress. You can sample new numbers and decompress them to get new images. Stable to train, but produced **blurry** outputs because of how the loss was designed (it averaged pixel values, which favors blur).
3. **Hand-crafted models** — restricted Boltzmann machines, deep belief nets. Did not scale.

Then in 2014, Ian Goodfellow had a different idea: **make two networks fight each other.** Network A (the **Generator**) makes fake images. Network B (the **Discriminator**) tries to tell the fakes apart from real photos. They both improve by competing. When the contest reaches a balance, Network A is producing images so convincing that Network B cannot tell them apart from the real ones.

That is the GAN. It was the first method that produced **sharp**, photorealistic images at scale. The idea is so simple it feels obvious in hindsight, and yet it unlocked an entire research field.

## A counterfeiter analogy

This is the analogy Goodfellow himself uses, because it works.

Imagine a counterfeiter trying to print fake money. At first, the fake money looks terrible — wrong colors, no watermarks. The police easily catch every fake. But the counterfeiter studies the police's feedback ("you missed the watermark") and improves. Now the fakes are slightly better. The police, in turn, get better at spotting subtle errors. The counterfeiter improves again. And so on.

After many rounds, the counterfeiter produces fakes that even experts struggle to tell from real bills. The Generator is the counterfeiter. The Discriminator is the police. Real bills are real data. Both get better by fighting.

The key insight is that **the police's job is the supervision signal for the counterfeiter**. The counterfeiter does not need anyone to say "your fake should have this exact serial number." They just need someone to say "this still looks fake." That is what makes GANs work when no clear "right answer" exists.

## What GANs are good at (the pros)

1. **Sharp outputs.** Compared to VAEs, GANs produce images with clear edges and fine textures. The discriminator punishes any blur — a blurry image looks fake, the D notices, the G learns to avoid blur. This is a built-in advantage of adversarial training.

2. **Fast at inference time.** Once trained, generating a sample is one forward pass through the Generator — basically free. Diffusion models (which dominate today) need 20–50 forward passes per sample, sometimes more. So GANs still win whenever you need real-time generation: video filters, games, super-resolution at 60 fps.

3. **Implicit modeling.** GANs do not compute a probability for each output. They just need to produce samples that look real. This sidesteps a lot of mathematical machinery and lets you use any architecture you want for G.

4. **Strong conditional control.** Once you condition a GAN on class labels (cGAN), images (Pix2Pix), or text, you get controllable generation. StyleGAN even gave us an editable latent space — you can move a single slider and turn a smile into a frown, or add glasses.

5. **State-of-the-art for some narrow tasks.** In 2026, Real-ESRGAN is still one of the best general-purpose image upscalers. StyleGAN3 is the standard for human face generation. HiFi-GAN is everywhere in text-to-speech as a vocoder. GANs did not "lose" — they specialized.

## What GANs are bad at (the cons)

1. **Training is unstable.** Two networks fighting can fail in many ways. The most famous failure is **mode collapse** — the Generator finds one image that fools the Discriminator and produces variations of that one image forever. Imagine trying to learn 1,000 cat breeds and only ever drawing the same orange tabby. We cover mode collapse and the other failures in Module 1.

2. **No likelihood.** GANs do not give you a probability for any image. You cannot ask "how likely is this image under my model?" This makes some downstream tasks (anomaly detection, exact density estimation) harder than they are with VAEs or autoregressive models.

3. **Hard to evaluate.** You cannot just compute "validation loss" — the loss is adversarial, it depends on the Discriminator, which is also learning. The metrics we use in practice (Inception Score, FID) are surrogates and have known blind spots. Module 5 covers them.

4. **Hyperparameter-sensitive.** Learning rates, batch sizes, regularization choices all matter a lot. A WGAN-GP that works on one dataset can completely fail on another with different hyperparameters. There is a reason GAN papers usually report a long list of training tricks.

5. **Diffusion has overtaken them at scale.** For text-to-image at the high end (DALL-E, Stable Diffusion, Flux, Imagen), diffusion models produce more diverse and more controllable outputs. GANs have lost the general-purpose generation race for now.

## Where GANs fit in 2026

We will return to this in Module 7, but here is the short version.

- **Diffusion dominates** general-purpose text-to-image generation (Stable Diffusion 3, Flux, Imagen 3, DALL-E 4).
- **GANs are still preferred** for speed-critical use cases: real-time face filters, video upscaling, deepfake software, vocoders in TTS systems.
- **Hybrids exist** that take the best of both: Diffusion-GAN, Adversarial Diffusion Distillation (SD-Turbo), Consistency Models with adversarial losses, StyleGAN-XL.

So GANs are not dead. They are a specialized tool with clear strengths. Knowing them well also deepens your understanding of generative modeling in general — many concepts (adversarial losses, mode collapse, FID) reappear in diffusion and even language models.

## A note on math notation

You will see equations in this handbook. Every time a new symbol appears, we will explain what it means in plain words. For example, the heart of the original GAN looks like this:

$$\min_G \max_D \; \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]$$

You do not need to read this right now. We will unpack it slowly in Module 1. But here is how to look at it without panicking:

- $\min_G$ — read "min G" — means "the Generator wants to make this number small."
- $\max_D$ — read "max D" — means "the Discriminator wants to make this number large."
- $\mathbb{E}_{x \sim p_{\text{data}}}[\,\cdot\,]$ — read "expected value of dot, when x is drawn from p-data" — means "the average value of $\cdot$ when $x$ is drawn from the real data." The fancy $\mathbb{E}$ is read as just "E" or "expected value."
- $\sim$ — read "tilde" — means "drawn from" or "sampled from." So $x \sim p_{\text{data}}$ = "x is a real data sample."
- $D(x)$ is what the Discriminator outputs for input $x$ — a number between 0 and 1 representing "how likely $x$ is to be real."
- $G(z)$ is a fake image the Generator produces from random noise $z$.
- $\log$ is the natural logarithm (read "log").

That is it. We go slowly.

## How to read Greek letters and math symbols

Many ML papers use Greek letters. They look intimidating only because most people never said them out loud. Here is a quick pronunciation guide for what you will meet in this handbook. Bookmark this section — it is easier to follow the math when you know what each symbol *sounds* like in your head.

### Greek letters

| Symbol | Read it as | What it usually means here |
|---|---|---|
| $\alpha$ | "alpha" | A weighting factor or step size |
| $\beta$ | "beta" | Momentum parameter in Adam; bias in normalization |
| $\gamma$ | "gamma" | A scale factor in normalization layers |
| $\delta$ | "delta" | A small change or difference |
| $\epsilon$ | "epsilon" (EP-si-lon) | A tiny positive number, often $10^{-8}$ |
| $\eta$ | "eta" (AY-ta) | Learning rate |
| $\theta$ | "theta" (THAY-ta) | Model parameters (the weights of a network) |
| $\lambda$ | "lambda" (LAM-da) | A weight balancing two terms in a loss |
| $\mu$ | "mu" (rhymes with "few") | Mean (the average value) |
| $\pi$ | "pi" (like "pie") | A probability or policy |
| $\rho$ | "rho" (like "row") | Correlation or density |
| $\sigma$ | "sigma" (SIG-ma) | Standard deviation; or the sigmoid function |
| $\Sigma$ | "capital sigma" | A covariance matrix |
| $\tau$ | "tau" (rhymes with "now") | Temperature or time |
| $\phi$ | "phi" (English: "fai" or "fee") | A function — often the discriminator's features |
| $\psi$ | "psi" (English: "sai") | Another function |
| $\chi$ | "chi" (English: "kai") | Used in $\chi^2$ (chi-squared) distances |
| $\omega$ | "omega" | Weights or angular frequency |
| $\nabla$ | "nabla" or "del" | Gradient (a vector of partial derivatives) |
| $\partial$ | "partial" | A partial derivative |

### Common math operators

| Symbol | Read it as | What it means |
|---|---|---|
| $\sum$ | "the sum" | Add everything in the sequence |
| $\int$ | "the integral" | Continuous version of a sum |
| $\mathbb{E}$ | "expected value" or just "E" | Average over a probability distribution |
| $\sim$ | "tilde" or "distributed as" | The random variable on the left is drawn from the distribution on the right |
| $\approx$ | "approximately equals" | Close to, but not exactly |
| $\propto$ | "is proportional to" | Equal up to a constant factor |
| $\hat{x}$ | "x hat" | An estimate or modified version of $x$ |
| $\bar{x}$ | "x bar" | An average value |
| $\tilde{x}$ | "x tilde" | A modified or noisy version of $x$ |
| $\|x\|$ or $\|x\|_2$ | "norm of x" / "L2 norm of x" | The length (magnitude) of vector $x$ |
| $\|x\|_1$ | "L1 norm of x" | Sum of absolute values of $x$'s entries |
| $\cdot$ | "dot" | Either multiplication or a placeholder, depending on context |
| $\in$ | "is in" or "element of" | Set membership: $x \in S$ means "$x$ is in $S$" |
| $\to$ | "goes to" | Direction of a mapping or a limit |
| $\mathcal{N}(0, I)$ | "normal zero, identity" | A standard normal (Gaussian) distribution centered at 0 |
| $\log$ | "log" | Natural logarithm (base $e$). In ML, "log" almost always means natural log. |
| $\exp$ | "exp" | The exponential function $e^x$ |
| $\sup$ | "sup" or "supremum" | The largest possible value (a "max" that always exists) |
| $\arg\min, \arg\max$ | "arg min, arg max" | The *input* that produces the minimum / maximum |

### Examples to read aloud

- $\mu = 0$ → "mu equals zero" (the average is zero).
- $\sigma^2$ → "sigma squared" (variance).
- $\theta^* = \arg\min_\theta \mathcal{L}(\theta)$ → "theta star equals arg min over theta of the loss function of theta" (the best parameters are the ones that minimize the loss).
- $\nabla_\theta \mathcal{L}$ → "nabla theta of L" or "the gradient of L with respect to theta."
- $x \sim \mathcal{N}(0, 1)$ → "x is distributed as a normal with mean zero and variance one."

Whenever you hit a symbol you do not know, say it in your head — that simple habit makes equations much easier to follow.

## Prerequisites checklist

Before starting Module 1, you should be able to:

- Write a small PyTorch model and train it on MNIST classification.
- Explain what cross-entropy loss does in one paragraph.
- Describe stochastic gradient descent in one paragraph.
- Read $\sum$, $\mathbb{E}$, $\log$ without panic.

If any of these are shaky, spend a weekend with the official PyTorch 60-minute tutorial first. You will get much more out of this handbook.

## How to read this handbook

1. **Read in order the first time.** Each module assumes the previous ones.
2. **Run the code.** Reading without running loses half the value.
3. **Skim the papers in Module 9 (Essential Reading) before bed; read them seriously the next morning.** Repeating helps the math sink in.
4. **For the practical track**, prioritize 01 → 03 → 06 (Real-ESRGAN) → 08 (end-to-end).

Let us start.
