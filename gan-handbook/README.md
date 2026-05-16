# GAN Handbook

A focused, undergraduate-friendly guide to Generative Adversarial Networks and their famous descendants. ~30k words across 13 files. We explain every equation and every line of code, so you can actually follow what is happening — not just nod along.

## Who this is for

Undergraduate students in their first 1–4 semesters of CS, AI, or related programs. You only need:

- Basic calculus (you know what a derivative is)
- Basic linear algebra (you can read $Ax + b$)
- Python and a working understanding of PyTorch
- A neural network in your head: forward pass, loss, gradient descent

Everything else is explained from scratch. Every new math symbol gets a "what this means" gloss the first time it appears.

## Read in this order

### Start here
- `00-overview.md` — Why GANs exist (when we already have neural networks), pros, cons, where they fit in 2026.

### Core modules (linear)
- `01-foundations.md` — Generator and Discriminator. The adversarial game. Original GAN math. Mode collapse and other training pathologies.
- `02-losses.md` — Loss vs objective function. Non-saturating loss, LSGAN, WGAN, WGAN-GP, SN-GAN, hinge, relativistic.
- `03-architectures.md` — DCGAN → Progressive GAN → SAGAN → BigGAN → StyleGAN family → GigaGAN. What happens when you modify G or D.
- `04-conditional.md` — Telling the GAN what to make. cGAN, AC-GAN, Pix2Pix, CycleGAN, StarGAN, SPADE, StackGAN.
- `05-evaluation.md` — How do we know a GAN is good? Inception Score, FID, KID, Precision-Recall, PPL.
- `06-applications.md` — Super-resolution (deep dive on Real-ESRGAN), inpainting, GAN inversion and editing, deepfakes.
- `07-vs-diffusion.md` — In 2026, diffusion is everywhere. Where GANs still win. Hybrids. Is GAN research dead?

### Hands-on
- `08-end-to-end.md` — A complete minimal GAN trainer you can run on a single GPU. ≤300 lines, fully commented.

### Reference and planning
- `09-essential-reading.md` — Tiered paper list.
- `10-learning-plan.md` — Three paces: sprint (2 weeks), standard (8 weeks), deep (16 weeks).

### Appendices (read as needed)
- `11-appendix-A-toolkit.md` — PyTorch idioms, torch-fidelity, lucidrains' repos, StyleGAN-ADA.
- `12-appendix-B-hardware.md` — VRAM, dataset prep, training time estimates.

## Suggested paths by goal

**Curious learner**: 00 → 01 → 02 → 03 → 06 → 07.

**Image-generation practitioner**: 00 → 01 → 03 (focus StyleGAN) → 04 → 06 → 08 → 11.

**Image-to-image projects** (Pix2Pix / CycleGAN): 00 → 01 → 04 → 08 → 11.

**Super-resolution (Real-ESRGAN)**: 00 → 01 → 06 → 11 → 12.

**Researcher**: 00 → 01 → 02 → 03 → 05 → 07 → 09 (deep papers).

## How to use

Math is explained inline. Every symbol gets a one-line gloss the first time it appears. Code snippets stay short and use PyTorch. The end-to-end module (08) ties it together with a working trainer.

If you have not seen a neural network before, do the 60-minute PyTorch tutorial first. Then come back.

## Conventions

- Math uses LaTeX (`$...$` and `$$...$$`). Renders on the website.
- "Modern" means state of the art as of early 2026.
- Each module ends with key papers and exercises.
- Code is PyTorch. Snippets are kept under 50 lines. The end-to-end trainer in Module 08 is the only big block.
