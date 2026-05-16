# Module 5 — Evaluation

How do you tell if a GAN is good? With a classifier you have accuracy. With a GAN you have... a fancy loss curve that does not even correlate with sample quality. This module covers the metrics people actually use.

## Learning goals

By the end of this module you can:

- Explain why evaluating generative models is intrinsically hard.
- Read Inception Score (IS), FID, KID, Precision-Recall, and PPL.
- Pick the right metric for your task.
- Know which metrics are known to mislead, and how.

## 5.1 Why evaluation is hard

Discriminative models have a clear yardstick: accuracy on a held-out test set. Generative models do not. The "ground truth" is *the distribution of real images*, and you cannot measure your model's distance to it directly — distributions are infinite-dimensional things.

So every GAN metric is a *surrogate*. We try to capture some aspect of:

- **Fidelity** — do the samples look real?
- **Diversity** — does the model cover the full distribution, not just one mode?
- **Alignment** (for conditional GANs) — do the samples match the conditioning?

No single metric captures all three perfectly. People report several, plus human evaluations for important results.

## 5.2 Inception Score — IS (2016)

The first widely used metric. Salimans et al. proposed it in the *Improved GAN training* paper.

**Idea.** Take a pretrained ImageNet classifier (Inception-v3). Feed your generated images to it. A good generator should:

1. Produce images that the classifier is *confident* about (one class is clearly the right answer). High fidelity → low entropy in $p(y|x)$.
2. Produce a *variety* of classes across many samples. High diversity → high entropy in marginal $p(y) = \int p(y|x) p(x)\, dx$.

The Inception Score combines both:

$$\text{IS}(G) = \exp\Big(\mathbb{E}_{x \sim G}\big[\text{KL}\big(p(y|x) \, \|\, p(y)\big)\big]\Big)$$

**Notation.**

- $p(y|x)$ = classifier's class distribution for image $x$.
- $p(y)$ = marginal class distribution (average $p(y|x)$ over all samples).
- $\text{KL}(P \| Q) = \sum_y P(y) \log \frac{P(y)}{Q(y)}$ — the Kullback-Leibler divergence, a measure of how different two distributions are.
- $\exp$ at the front is just there to make IS positive and easier to interpret.

**Interpretation.** A high IS means classifiers are confident *and* the marginal class distribution is broad. The original 50,000-image ImageNet test set scores about 240 IS. CIFAR-10 generators today score 8–10.

**Known problems.**
- **It uses ImageNet's classifier.** If your images are not ImageNet-like (faces, medical images), IS is meaningless.
- **No comparison to real data.** IS does not directly measure similarity to the training distribution. A generator that produces 1000 perfect images of 1000 different ImageNet classes would score very high — but if those 1000 images are not in the training distribution at all, IS will not notice.
- **Mode collapse can hide inside.** As long as G covers many classes, IS rewards it, even if within each class G only produces one image.

IS was important historically but is no longer the primary metric. We mostly use FID.

## 5.3 FID — Fréchet Inception Distance (2017)

This is the standard. Heusel et al. fixed the main flaw in IS by *directly comparing* generated and real images in a shared feature space.

**Idea.** Run real images and generated images through Inception-v3. Take the activations of an intermediate layer (typically 2048-dimensional). Fit a multivariate Gaussian to each set. Compute the distance between the two Gaussians using the **Fréchet distance**:

$$\text{FID} = \|\mu_r - \mu_g\|_2^2 + \text{Tr}\big(\Sigma_r + \Sigma_g - 2(\Sigma_r \Sigma_g)^{1/2}\big)$$

**Notation.**

- $\mu_r, \Sigma_r$ — mean and covariance of real-image features.
- $\mu_g, \Sigma_g$ — same for generated images.
- $\|\mu_r - \mu_g\|_2^2$ — squared Euclidean distance between mean vectors.
- $\text{Tr}(\cdot)$ — trace of a matrix (sum of diagonal entries).
- $(\Sigma_r \Sigma_g)^{1/2}$ — the matrix square root.

**Plain-English reading.** FID = "how different are the average feature and the spread of features between real and generated images?" Lower is better.

**Reference numbers (rough).**
- ImageNet 128×128 BigGAN: ~7 FID.
- StyleGAN2 on FFHQ faces: ~2.7 FID.
- Real test set vs real train set: ~1–3 FID (the floor).

**Practical use.**
- Compute on 50K generated samples vs 50K reals. Smaller sample sizes give biased estimates.
- The standard library is `torch-fidelity` or `clean-fid`. Use clean-fid if you want results comparable to the original papers (it handles image resizing carefully).
- FID is **biased**: it depends on the number of samples. Always use the same N when comparing models.

**Known problems.**
- **Uses Inception's features.** Pre-trained on ImageNet. May not reflect quality for very different domains.
- **Insensitive to memorization.** A G that memorizes the training set will score perfectly even though it is useless.
- **Single number for two aspects.** Cannot separate fidelity from diversity. We need Precision-Recall (below).

## 5.4 KID — Kernel Inception Distance (2018)

A variant of FID that uses the **maximum mean discrepancy (MMD)** with a polynomial kernel instead of fitting Gaussians.

$$\text{KID} = \text{MMD}^2(\{\phi(x_i)\}, \{\phi(\tilde x_j)\})$$

**Notation.** $\phi(\cdot)$ are Inception features. The MMD compares the two sets by averaging a kernel function over pairs.

**Why it exists.** FID has a bias when you use few samples. KID is **unbiased** — you can compute it on 1,000 samples and the answer is meaningful. Useful for small-data regimes.

In practice, KID and FID agree on rankings, so most papers report FID. Report KID when sample sizes are small or you want bias-corrected numbers.

## 5.5 Precision and Recall (2019)

Kynkäänniemi et al. observed that FID conflates "make realistic samples" with "cover the data." They proposed splitting them.

**Idea.** Estimate the support of real and generated distributions in Inception's feature space using k-nearest-neighbors.

- **Precision** = fraction of generated samples that fall inside the real manifold. High precision = "samples look real."
- **Recall** = fraction of real samples that fall inside the generated manifold. High recall = "G covers the variety of real data."

**Why useful.** A mode-collapsed G can have *high precision* (its few outputs all look real) but *low recall* (it misses everything else). FID would punish this somewhat, but Precision-Recall makes the trade-off explicit.

In production papers like StyleGAN2-ADA, you will see Precision and Recall reported alongside FID. They are particularly useful for diagnosing what is failing.

## 5.6 Perceptual Path Length — PPL (2019)

Specific to StyleGAN-style architectures with editable latent spaces. Measures how *smoothly* the generator's output changes as you move in latent space.

$$\text{PPL} = \mathbb{E}_{w, t}\Big[\frac{1}{\epsilon^2}\, d\big(G(w + t \, n), G(w + (t+\epsilon) \, n)\big)\Big]$$

**Notation.**

- $w$ = a latent code.
- $n$ = a random unit-direction in latent space.
- $t \in [0, 1]$ = a position along the path.
- $\epsilon$ = a small step size.
- $d(\cdot, \cdot)$ = LPIPS perceptual distance between two images.

**Plain English.** Pick a random direction in latent space. Take a tiny step. How much does the image change? PPL averages this over many directions. Lower PPL = smoother latent space = "moving in latent space causes smooth, predictable image changes."

StyleGAN2 explicitly minimizes a path-length regularizer in training. Useful for editing applications where you want sliders that work consistently.

## 5.7 Other metrics (briefly)

- **CLIP Score** for text-to-image. Measure cosine similarity between CLIP's embedding of the prompt and the image. High = the image matches the caption.
- **PSNR / SSIM** for super-resolution. Pixel-level similarity to the ground-truth high-res image. Important but does *not* measure perceptual quality well — see Module 6 for what GANs do differently here.
- **Human evaluation.** Two-alternative forced choice ("which image looks more real?") with hundreds of trials. Slow and expensive but the gold standard for fidelity.

## 5.8 Common pitfalls

1. **Comparing across implementations.** Different image preprocessing (resize methods, JPEG vs PNG, color space) changes FID by 1–3 points. Use `clean-fid` for reproducible comparisons.
2. **Reporting one number.** A single FID hides whether the model is missing diversity or making unrealistic images. Always report Precision-Recall too if you can.
3. **Using too few samples.** FID with 1,000 samples is much higher than FID with 50,000 from the same model. Always state your sample count.
4. **Cherry-picking.** Generating 1,000 images and reporting the best 10 is dishonest. Report a random batch.
5. **Memorization.** A generator that copies training images will have a great FID. Use a memorization test (nearest-neighbor lookup) to rule this out.

## 5.9 Recommended evaluation protocol

For a typical paper or thesis:

1. Compute FID on 50K generated vs 50K real, using `clean-fid`.
2. Compute Precision and Recall on the same sets.
3. Run a memorization check: nearest-neighbor in pixel space for 50 random generated samples.
4. Show qualitative samples (uncherry-picked: random batch of 64).
5. If your G has an editable latent space, report PPL.
6. For text-to-image, also report CLIP Score.
7. For super-resolution, also report PSNR / SSIM / LPIPS.

## Key papers

- Salimans et al., *Improved Techniques for Training GANs*, NeurIPS 2016. (IS)
- Heusel et al., *GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium*, NeurIPS 2017. (FID + TTUR)
- Bińkowski et al., *Demystifying MMD GANs*, ICLR 2018. (KID)
- Kynkäänniemi et al., *Improved Precision and Recall Metric for Assessing Generative Models*, NeurIPS 2019.
- Karras et al., *A Style-Based Generator Architecture for GANs (StyleGAN)*, CVPR 2019. (PPL)

## Exercises

1. Install `torch-fidelity` (or `clean-fid`). Compute FID for the DCGAN you trained in Module 1.
2. Train two GANs: one with a small G (a "weak" generator), one with a large G. Compare FID, Precision, and Recall. Verify that the large G has both higher Precision and higher Recall.
3. Force a mode-collapsed GAN by setting its noise dimension to 4 (very small). Compute FID and Precision-Recall. Confirm: Precision can stay high while Recall collapses.
4. Read the FID paper, section 4. Reproduce the experiment showing FID is more robust than IS to mode dropping.
