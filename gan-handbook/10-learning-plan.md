# Module 10 — Learning Plan

Three paces, depending on your time and goal. Pick one and stick to it. The trap is hopping between tracks — read a paper or implement code, never both at once.

## Sprint — 2 weeks, ~10 hours/week

Goal: working knowledge. You can read GAN papers, train a baseline, and pick the right loss / architecture for a small project.

| Day | Reading | Code |
|---|---|---|
| 1 | Modules 0–1 | Set up PyTorch. Run the MNIST DCGAN from Module 8. |
| 2 | Module 2 (losses) | Modify the DCGAN to use hinge loss. Compare D and G curves. |
| 3 | Module 3 (architectures) | Add spectral normalization to D. |
| 4 | Goodfellow 2014 paper | Re-read Module 1.5 (failure modes). Force mode collapse on purpose. |
| 5 | Module 4 (conditional) | Train a class-conditional MNIST GAN. |
| 6 | DCGAN paper + Pix2Pix paper | — |
| 7 | Module 5 (evaluation) | Compute FID for your DCGAN with `torch-fidelity`. |
| 8 | Module 6 (applications) | Run pretrained Real-ESRGAN on 5 of your own photos. |
| 9 | Real-ESRGAN paper | Sketch its second-order degradation pipeline from memory. |
| 10 | Module 7 (vs diffusion) | — |
| 11 | StyleGAN paper, sections 1–3 | Run pretrained StyleGAN3 inference. |
| 12 | StyleGAN2 paper, sections 1–4 | Read `train.py` of any official StyleGAN repo. Identify each module's concepts in it. |
| 13 | Catch up day | Finalize any unfinished exercise. |
| 14 | Pick a Tier 1 paper you skipped. Read seriously. | Reflect: write a one-paragraph "what I learned" note. |

## Standard — 8 weeks, ~6 hours/week

Goal: deep working knowledge. You can implement a non-trivial GAN from scratch and reason about training failures.

**Week 1.** Modules 0, 1. Goodfellow 2014. Implement vanilla GAN on MNIST.
**Week 2.** Module 2. WGAN and WGAN-GP papers. Implement WGAN-GP on CIFAR-10. Reproduce paper numbers (~FID 25 with a small model).
**Week 3.** Module 3. DCGAN, Progressive GAN papers. Build a 64×64 GAN. Add spectral norm. Train on CelebA (subset).
**Week 4.** Module 4. cGAN, Pix2Pix, CycleGAN papers. Implement Pix2Pix from scratch on `edges2shoes`.
**Week 5.** Module 5. FID paper, Improved Precision-Recall paper. Implement FID computation by hand (do not use `torch-fidelity`).
**Week 6.** Module 6. SRGAN, ESRGAN, Real-ESRGAN papers. Train SRGAN on a custom dataset.
**Week 7.** Module 7. Read the Consistency Models paper and SD-Turbo paper. Write a 1-page comparison between GAN and diffusion for the task you care about.
**Week 8.** StyleGAN, StyleGAN2 papers. Capstone project of your choice. Build, train, evaluate, write up.

## Deep — 16 weeks, ~6 hours/week

Goal: research-ready. You can read recent papers fluently, implement state-of-the-art, and contribute your own ideas.

**Weeks 1–4.** Same as Standard weeks 1–4.

**Week 5.** Spectral Normalization paper. Mescheder et al. "Which Training Methods... Converge?" paper (R1 regularizer). Implement both. Read 50 lines of StyleGAN2's official training code each day this week.

**Week 6.** Re-read Modules 1–3. Reproduce a published FID number on a benchmark of your choice (CIFAR-10 hinge baseline is a good target).

**Week 7.** Modules 5–6 in depth. SRGAN, ESRGAN, Real-ESRGAN papers. Implement ESRGAN from scratch.

**Week 8.** GAN inversion. Image2StyleGAN, e4e, StyleCLIP. Invert a real photo with both optimization-based and encoder-based methods.

**Week 9.** SAGAN, BigGAN, Projection Discriminator papers. Implement projection D for class-conditional CIFAR-10.

**Week 10.** StyleGAN, StyleGAN2 papers. Read StyleGAN2's full PyTorch implementation (lucidrains or NVIDIA). Identify each architectural choice.

**Week 11.** StyleGAN2-ADA, StyleGAN3 papers. Understand augmentation invariance and aliasing.

**Week 12.** Conditional, semantic synthesis: Pix2Pix, CycleGAN, StarGAN-v2, SPADE. Build a CycleGAN for a domain pair you care about.

**Week 13.** Audio (HiFi-GAN paper). Implement a small MelGAN.

**Week 14.** Hybrids: Diffusion-GAN, ADD, Consistency Models. Implement SD-Turbo distillation from a pretrained diffusion teacher.

**Week 15.** Pick a recent NeurIPS / ICML / CVPR GAN paper from the past year. Read it carefully. Reimplement the core method.

**Week 16.** Capstone: write a workshop-paper-sized contribution. Pick a niche problem (medical image super-resolution, specific-domain transfer, audio GAN). Train, evaluate, write up.

## Cross-cutting habits

- **Read with a notebook open.** Write down: what is the contribution, what is the math, what would I ablate.
- **Implement before you fully understand.** Reading alone gives you 30% of the value. Implementing forces you to fill in everything you skimmed.
- **Train on small data first.** A 30-minute run on MNIST teaches you more than a week of cooling waiting for ImageNet.
- **Watch your training curves.** D(real), D(fake), and a sample grid every epoch are your minimum dashboard.
- **One change at a time.** Do not switch loss AND architecture in the same run. You will not know what helped.
