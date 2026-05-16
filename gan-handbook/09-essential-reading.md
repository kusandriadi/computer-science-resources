# Module 9 — Essential Reading

A tiered paper list. Tier 1 is the must-read core. Tier 2 fills in important context. Tier 3 is specialized — read only when you go deeper into a sub-area.

For each paper, read in this order: abstract → conclusion → figures → method. Skip details on first pass.

## Tier 1 — Must read

These ten papers are the canon. If you can summarize each in 3 sentences, you have a solid foundation.

1. **Goodfellow et al., *Generative Adversarial Nets*, NeurIPS 2014.** The original. The math in section 4 is short.
2. **Radford et al., *Unsupervised Representation Learning with DCGANs*, ICLR 2016.** First practical GAN architecture.
3. **Arjovsky et al., *Wasserstein GAN*, ICML 2017.** Re-grounds GAN training on the Wasserstein distance.
4. **Gulrajani et al., *Improved Training of Wasserstein GANs*, NeurIPS 2017.** Gradient penalty. The practical version of WGAN that actually worked.
5. **Karras et al., *Progressive Growing of GANs*, ICLR 2018.** First high-res GAN. Worth reading just for the training curves.
6. **Miyato et al., *Spectral Normalization*, ICLR 2018.** Cheap, robust Lipschitz constraint.
7. **Karras et al., *A Style-Based Generator (StyleGAN)*, CVPR 2019.** Editable latent space. Most-cited GAN paper.
8. **Heusel et al., *GANs Trained by a Two Time-Scale Update Rule*, NeurIPS 2017.** Introduces FID and TTUR.
9. **Isola et al., *Pix2Pix*, CVPR 2017.** Paired image translation.
10. **Zhu et al., *CycleGAN*, ICCV 2017.** Unpaired image translation.

## Tier 2 — Strongly recommended

11. Salimans et al., *Improved Techniques for Training GANs*, NeurIPS 2016. (Mini-batch discrimination, IS, many heuristics.)
12. Mirza & Osindero, *Conditional GAN*, 2014.
13. Brock et al., *BigGAN*, ICLR 2019. (Scale.)
14. Karras et al., *StyleGAN2*, CVPR 2020. (Fixed the artifacts.)
15. Karras et al., *StyleGAN2-ADA*, NeurIPS 2020. (Small-data training.)
16. Karras et al., *StyleGAN3*, NeurIPS 2021. (Equivariance fix.)
17. Choi et al., *StarGAN-v2*, CVPR 2020.
18. Park et al., *SPADE*, CVPR 2019.
19. Ledig et al., *SRGAN*, CVPR 2017.
20. Wang et al., *ESRGAN*, ECCVW 2018.
21. Wang et al., *Real-ESRGAN*, ICCVW 2021.
22. Kong et al., *HiFi-GAN*, NeurIPS 2020.
23. Mao et al., *LSGAN*, ICCV 2017.
24. Lim & Ye, *Geometric GAN (hinge)*, 2017.
25. Zhang et al., *Self-Attention GAN (SAGAN)*, ICML 2019.
26. Kynkäänniemi et al., *Improved Precision and Recall*, NeurIPS 2019.

## Tier 3 — Specialized

For depth in one sub-area. Sample as needed.

**GAN inversion and editing**
- Abdal et al., *Image2StyleGAN*, ICCV 2019.
- Tov et al., *Designing an Encoder for StyleGAN (e4e)*, SIGGRAPH 2021.
- Patashnik et al., *StyleCLIP*, ICCV 2021.
- Härkönen et al., *GANSpace*, NeurIPS 2020.

**Conditional D variants**
- Miyato & Koyama, *cGANs with Projection Discriminator*, ICLR 2018.
- Odena et al., *AC-GAN*, ICML 2017.

**Inpainting**
- Pathak et al., *Context Encoders*, CVPR 2016.
- Yu et al., *DeepFill v2*, ICCV 2019.
- Suvorov et al., *LaMa*, WACV 2022.

**Hybrids with diffusion**
- Sauer et al., *Adversarial Diffusion Distillation (SD-Turbo)*, 2023.
- Wang et al., *Diffusion-GAN*, ICLR 2023.
- Song et al., *Consistency Models*, ICML 2023.

**Scale**
- Kang et al., *GigaGAN*, CVPR 2023.
- Sauer et al., *StyleGAN-T*, ICML 2023.

**Theory you can skip on first pass**
- Mescheder et al., *Which Training Methods for GANs Do Actually Converge?*, ICML 2018. (R1 regularizer.)
- Mescheder, *The Numerics of GANs*, NeurIPS 2017. (Game-theoretic analysis.)

## A reading discipline

For every paper you decide to read seriously:

1. **Abstract and conclusion.** Predict the contribution.
2. **Figures.** Often the clearest explanation of the idea.
3. **Method.** Sketch the algorithm in your own notation.
4. **Results.** Note one result you would ablate or re-test.
5. **Implement.** Even a 30-minute partial reimplementation cements the idea.

Step 5 is the one most people skip. Do not.

## Useful repositories

- [`lucidrains/stylegan2-pytorch`](https://github.com/lucidrains/stylegan2-pytorch) — clean PyTorch StyleGAN2.
- [`NVlabs/stylegan3`](https://github.com/NVlabs/stylegan3) — official.
- [`xinntao/Real-ESRGAN`](https://github.com/xinntao/Real-ESRGAN) — official Real-ESRGAN.
- [`junyanz/pytorch-CycleGAN-and-pix2pix`](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix) — official CycleGAN.
- [`jik876/hifi-gan`](https://github.com/jik876/hifi-gan) — official HiFi-GAN.
- [`omertov/encoder4editing`](https://github.com/omertov/encoder4editing) — e4e for StyleGAN editing.
