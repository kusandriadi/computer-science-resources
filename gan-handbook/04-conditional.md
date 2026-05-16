# Module 4 — Conditional Generation and Image-to-Image Translation

So far the GANs in Modules 1–3 are *unconditional* — you feed noise, you get an image. You cannot tell the GAN *what* to make. This module is about giving the GAN inputs that control its output: a class label, a sketch, another image, a text caption.

## Learning goals

By the end of this module you can:

- Explain the difference between an unconditional and a conditional GAN.
- Implement cGAN, Pix2Pix, and CycleGAN at a high level.
- Choose between paired (Pix2Pix-style) and unpaired (CycleGAN-style) translation.
- Recognize SPADE and StarGAN in production code.

## 4.1 Conditional GAN — cGAN (2014)

The first conditional GAN, by Mirza & Osindero, came out the same year as the original. The idea is one line different from vanilla:

> Feed the same conditioning $y$ to **both** G and D.

Compare:

| Network | Vanilla GAN | cGAN |
|---|---|---|
| Generator | $G(z)$ | $G(z, y)$ |
| Discriminator | $D(x)$ | $D(x, y)$ |

**Conditioning $y$** can be anything: a one-hot class label, a one-hot digit class, an embedding of a sentence, a pose vector. Whatever you want G to listen to.

In practice for class-conditional MNIST:

```python
class cGenerator(nn.Module):
    def __init__(self, z_dim=100, n_classes=10, img_dim=28*28):
        super().__init__()
        self.label_emb = nn.Embedding(n_classes, n_classes)
        self.net = nn.Sequential(
            nn.Linear(z_dim + n_classes, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim), nn.Tanh(),
        )
    def forward(self, z, labels):
        c = self.label_emb(labels)
        return self.net(torch.cat([z, c], dim=1))
```

D receives `[image, label]` and outputs real/fake. The Discriminator's job is now harder: not just "is this a real image?" but "is this a real image *of class y*?" That additional constraint forces G to actually produce the class you ask for.

cGAN is the foundation. Almost every conditional image generator you have ever used is some variation.

### AC-GAN (2016)

A small twist on cGAN by Odena et al. Instead of D taking `[image, label]`, D takes only the image and outputs *two* things:
1. Is this real or fake? (real/fake head)
2. What class is it? (classification head)

This sometimes works better because D has a more structured task. Used in early ImageNet-conditional work, less common today.

### Projection Discriminator (2018)

The cleanest way to do class-conditional D. Instead of concatenating the label, project it into D's feature space. Used by BigGAN and most modern class-conditional GANs.

Roughly:

$$D(x, y) = \phi(x)^\top y + \psi(x)$$

where $\phi$ is the conv backbone, $y$ is a learnable class embedding, and $\psi$ is an unconditional real/fake head. The dot product $\phi(x)^\top y$ scores the alignment between the image and the class.

## 4.2 Pix2Pix — paired image translation (2016)

Now consider a different kind of "conditioning": instead of a class label, the input is a *whole image*. Examples:

- Edge map → realistic photo
- Daytime scene → nighttime scene
- Grayscale → color
- Architectural sketch → rendered building

The output is also a whole image. We want $G: \text{image}_A \to \text{image}_B$.

**Pix2Pix** (Isola et al.) made this work with two ideas:

### 1. Use a U-Net for G

A U-Net is an encoder-decoder with skip connections from each encoder layer to the matching decoder layer. The skip connections matter because input and output share *low-level structure* — edges in the input map directly to edges in the output. Sending raw features through skip connections preserves that structure.

```
input image
   ↓ conv
   ↓ conv ── skip ──┐
   ↓ conv ── skip ──┤
   ↓ conv (bottleneck)
   ↑ upconv ←── skip
   ↑ upconv ←── skip
   ↑ upconv
output image
```

### 2. Use a PatchGAN for D

Instead of D outputting one real/fake number for the whole image, D outputs a grid of real/fake scores — one per "patch" of the image (e.g., a 70×70 patch). The total D loss is the average over patches.

Why patches? Because we mostly care about *local realism*. If every 70×70 patch looks real, the whole image looks real, and we don't waste D's capacity scoring global composition that the L1 loss (next paragraph) already handles.

### 3. Add an L1 reconstruction loss

Pix2Pix uses both the adversarial loss and a plain L1 loss between $G(A)$ and the ground-truth target $B$:

$$L_{\text{Pix2Pix}} = L_{\text{GAN}}(G, D) + \lambda \, \|B - G(A)\|_1$$

**Notation.** $\|\cdot\|_1$ is the L1 norm — sum of absolute pixel differences. $\lambda$ is a weight, usually 100.

The L1 loss handles low-frequency structure ("the image should match overall"). The GAN loss handles high-frequency detail ("the image should be sharp and realistic"). Together they avoid both blurriness (pure L1) and unfaithful outputs (pure GAN).

**Requirement: paired data.** You need exact (A, B) pairs to train Pix2Pix. For sketch-to-photo, you would need actual sketches and the corresponding photos. That is often hard to get.

## 4.3 CycleGAN — unpaired image translation (2017)

What if you have a pile of horse photos and a pile of zebra photos, but no exact horse-zebra pairs? Pix2Pix cannot help. **CycleGAN** (Zhu et al.) solved this.

The idea: train **two** generators and **two** discriminators.

- $G: A \to B$ — turns a horse into a zebra
- $F: B \to A$ — turns a zebra into a horse
- $D_A$ — tells real horses from fake horses
- $D_B$ — tells real zebras from fake zebras

The training objective combines:

1. **Two adversarial losses** — one for each direction.
2. **Cycle consistency loss.** If you turn a horse into a zebra and back into a horse, you should get the *same* horse:

$$L_{\text{cyc}} = \mathbb{E}_a[\|F(G(a)) - a\|_1] + \mathbb{E}_b[\|G(F(b)) - b\|_1]$$

**Notation.** $a, b$ are samples from the two unpaired collections (horse photos and zebra photos). $F(G(a))$ is "go to zebra, then back to horse." $\|\cdot\|_1$ is L1.

This consistency constraint is what prevents G from "cheating" by mapping every horse to the same zebra (mode collapse), since then $F$ would have no way to recover the original horse.

### Why cycle consistency works (intuition)

Without the cycle loss, $G$ could map "any horse → famous zebra image #4" and $F$ could map "any zebra → famous horse image #7." Both Ds would be satisfied because the outputs are real-looking. But the input-output pairs make no sense.

The cycle loss says: "after a round-trip, you have to recover the original." That forces $G$ and $F$ to preserve enough information about the input image to invert the translation. In practice that means preserving things like *pose*, *background*, and *body shape* — exactly what we want.

CycleGAN works for many "style transfer" tasks: photo ↔ Monet, summer ↔ winter, apple ↔ orange. It does not work when the two domains differ in *shape* (cat ↔ dog often fails — they have different geometries that pure pixel-level cycling can't preserve).

## 4.4 UNIT and MUNIT — disentangled translation (2017, 2018)

CycleGAN translates one-to-one (one horse → one specific zebra). What if you want one-to-many (one cat → many possible dogs)? **MUNIT** (Multimodal UNIT) does this by splitting each image's representation into:

- A **content** code (shared across domains — pose, shape)
- A **style** code (domain-specific — texture, color)

You combine content from image A with style from a random sample of domain B to get a translated image with controllable style. Out of fashion as of 2026 — diffusion handles multi-modal translation more easily — but the idea (separating content and style) is recurring and worth knowing.

## 4.5 StarGAN — translate between many domains at once (2017)

CycleGAN trains one model per pair of domains. If you have 10 hair colors, you need $\binom{10}{2} = 45$ separate models. **StarGAN** (Choi et al.) handles all of them with one model.

The trick: G takes an image and a *target domain label* $y$, and outputs the translated image:

$$\hat{x} = G(x, y)$$

D outputs both real/fake and a domain classifier (similar to AC-GAN). You can train one StarGAN on a face dataset with attributes (blond/brown/black hair, young/old, smile/no-smile) and switch between them with a vector.

**StarGAN-v2** (2020) extends this with a style code, so you get multi-modal translation across many domains in one model.

## 4.6 SPADE / GauGAN — semantic image synthesis (2019)

Input: a segmentation mask. Output: a photorealistic image matching the mask.

Park et al. (NVIDIA) noticed that vanilla BatchNorm in G erases the spatial information from the segmentation mask. Their fix: **Spatially-Adaptive Normalization (SPADE)**.

$$\text{SPADE}(x, m) = \gamma(m) \cdot \frac{x - \mu(x)}{\sigma(x)} + \beta(m)$$

**Notation.** Same as AdaIN, but $\gamma$ and $\beta$ are now *spatial maps* derived from the segmentation mask $m$. Each pixel gets its own scale and shift, conditioned on what semantic class it belongs to at that location.

This was the foundation of **GauGAN** — NVIDIA's interactive tool where you paint a rough segmentation map ("sky here, water here, mountain here") and get a photorealistic landscape. The tool actually shipped to artists.

## 4.7 Text-to-image, the pre-diffusion era

Before Stable Diffusion (2022), the leading text-to-image methods were GAN-based:

- **StackGAN** (2016) — generate at 64×64 from text, then refine to 256×256.
- **AttnGAN** (2017) — uses attention between words and image patches.
- **DM-GAN, DF-GAN** (2019–2020) — refinement on the same general approach.

These produced okay results for simple captions ("a yellow bird with a black head") but failed on complex compositions. Once diffusion arrived, this whole branch became niche. We mention it for historical completeness; if you want text-to-image in 2026, use diffusion.

## 4.8 Practical guide — picking the right conditional GAN

| Have | Want | Model |
|---|---|---|
| Class labels | Class-conditional images | cGAN or BigGAN (projection D) |
| Paired (A, B) images | Translate A → B | Pix2Pix |
| Unpaired A and B collections | Translate A ↔ B | CycleGAN |
| Many domains, no pairs | One-model translation | StarGAN-v2 |
| Segmentation masks | Photorealistic image | SPADE / GauGAN |
| Text captions, high quality | Text → image | **Use diffusion, not GAN.** Stable Diffusion or Flux. |
| Text, but need speed | Text → image fast | GigaGAN or StyleGAN-T |

## Key papers

- Mirza & Osindero, *Conditional Generative Adversarial Nets*, 2014.
- Isola et al., *Image-to-Image Translation with Conditional Adversarial Networks (Pix2Pix)*, CVPR 2017.
- Zhu et al., *Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks (CycleGAN)*, ICCV 2017.
- Choi et al., *StarGAN*, CVPR 2018.
- Park et al., *Semantic Image Synthesis with Spatially-Adaptive Normalization (SPADE)*, CVPR 2019.
- Miyato & Koyama, *cGANs with Projection Discriminator*, ICLR 2018.

## Exercises

1. Train cGAN on MNIST and produce a grid where each row is a single digit class, each column is a different $z$. Inspect that the classes are correct.
2. Implement the cycle consistency loss in PyTorch from scratch given existing $G$ and $F$ models. Verify the gradient flows through both networks.
3. Read the Pix2Pix paper. Identify why the authors prefer L1 over L2 for the reconstruction loss. (Hint: L2 averages, L1 picks medians.)
4. Find a pretrained CycleGAN checkpoint (horse2zebra) and run inference on your own horse photo. Save the cycled-back result. Compare to the original.
