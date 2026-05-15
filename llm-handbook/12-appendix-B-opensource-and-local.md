# Appendix B — Open Source LLMs and Local Setup

You cannot truly understand LLMs by only calling APIs. You need to run models yourself, poke at them, break them, and fine-tune them. This appendix gets you there.

It has two purposes:

1. Give you a map of the **open-weights model ecosystem** as it stands in 2026.
2. Get you actually **running models locally** today, with Ollama and friends.

APIs are convenient, but you cannot inspect weights, run ablations, or fine-tune a black box. Open weights are how you build real intuition.

## B.1 Why open source matters

- **Inspection**: you can run profilers, look at weights, study internals.
- **Fine-tuning**: full control over post-training (Module 3).
- **Cost**: serve at marginal hardware cost, not per-token API pricing.
- **Privacy / sovereignty**: data stays on your hardware.
- **No deprecation**: a model you have weights for never disappears.
- **Reproducibility**: research that depends on closed APIs ages badly.

Tradeoff: frontier closed models (Claude, GPT, Gemini) still typically lead on quality, especially for reasoning and agentic work. Use both — open models for control, frontier APIs for capability ceiling.

## B.2 Open model families (2026)

A non-exhaustive map. License terms vary; check before commercial deployment.

### Meta — Llama family
- **Llama 3.1** (8B, 70B, 405B) — strong general models, dense.
- **Llama 3.2** (1B, 3B text; 11B, 90B multimodal).
- **Llama 3.3 70B** — refresh focused on instruction quality.
- **Llama 4** family — MoE entries.
- Custom license, usable commercially with caveats. Massive ecosystem.

### Mistral
- **Mistral 7B**, **Mixtral 8x7B / 8x22B** — early influential open models.
- **Mistral Small / Medium / Large** open releases.
- **Codestral** for code.
- Apache 2.0 for most open releases; some newer ones under Mistral Research License.

### Alibaba — Qwen family
- **Qwen3** series (0.6B → 235B-A22B MoE).
- Strong multilingual, especially Chinese; competitive English.
- **Qwen3-Coder**, **Qwen3-VL**, **Qwen3-Embedding**, **Qwen3-Math**.
- Apache 2.0 for most weights. One of the most-used open families.

### DeepSeek
- **DeepSeek-V3** (671B total / 37B active MoE) — frontier-competitive open base.
- **DeepSeek-R1** family — open reasoning models with distilled smaller variants.
- **DeepSeek-Coder-V2**, **DeepSeek-Math**.
- MIT-style licenses. Outsize technical impact relative to size of the team.

### Google — Gemma
- **Gemma 2** (2B, 9B, 27B).
- **Gemma 3** (1B–27B) with multimodal.
- Permissive license. Lightweight options that punch above their weight class.

### Microsoft — Phi
- **Phi-3 / 3.5 / 4** family (mini, small, medium, MoE).
- Strong reasoning-per-parameter via synthetic data emphasis.
- MIT license.

### Allen AI — OLMo
- **OLMo 2** family.
- Fully open: weights, data, code, training logs. The reference for *reproducible* open science.
- Not always SOTA on benchmarks; unmatched on transparency.

### Other notable
- **Cohere Command-R / R+** — RAG-oriented, multilingual.
- **NVIDIA Nemotron** — Llama-derived, NVIDIA-tuned.
- **xAI Grok** open releases.
- **Falcon** (TII) — historically important; less active.
- **Yi**, **InternLM**, **MiniCPM**, **GLM**, **Baichuan** — strong Chinese-origin model families.
- **SmolLM** (HF) — efficient small models with open training data.
- **Apple OpenELM / DCLM** — Apple's open contributions.

### How to choose

For **general assistant** quality at small scale: Llama 3.x or Qwen3 in the 7B–14B range.

For **frontier-competitive open**: DeepSeek-V3, Qwen3 MoE, Llama 4 large.

For **reasoning**: DeepSeek-R1 distilled variants, QwQ, Qwen3-Math.

For **coding**: Qwen3-Coder, DeepSeek-Coder, Codestral.

For **on-device / mobile**: Gemma 3 1B, Llama 3.2 1B/3B, Phi-3 mini, SmolLM.

For **reproducible research**: OLMo 2.

For **non-English**: Qwen3 (CJK + many others), Mistral (European languages), regional fine-tunes.

For **multimodal**: Qwen3-VL, Llama 3.2 Vision, Pixtral (Mistral), Gemma 3.

**Pragmatic rule**: download two or three models in the size class your hardware supports, try them on *your* tasks, and decide based on that — leaderboards are noisy proxies.

## B.3 Model sizes and hardware

Rough memory requirements (weights only; add 1–10 GB for KV cache):

| Params | FP16/BF16 | INT8 | INT4 (Q4_K_M) |
|--------|-----------|------|---------------|
| 1B     | 2 GB      | 1 GB | 0.7 GB        |
| 3B     | 6 GB      | 3 GB | 2 GB          |
| 7B     | 14 GB     | 7 GB | 4 GB          |
| 13B    | 26 GB     | 13 GB | 8 GB         |
| 30B    | 60 GB     | 30 GB | 18 GB        |
| 70B    | 140 GB    | 70 GB | 40 GB        |
| 405B   | 810 GB    | 405 GB | 230 GB      |

What you can run:
- **8 GB GPU / Mac**: up to 7B at Q4.
- **16 GB GPU / Mac**: up to 13B at Q4, or 7B at higher precision.
- **24 GB GPU (3090/4090)**: up to 30B at Q4, or 13B at fp16.
- **48 GB (A6000, dual 3090/4090)**: up to 70B at Q4.
- **80 GB (H100/A100)**: 70B at INT8, larger with offloading.
- **Multiple H100 / B200**: frontier-scale open models.

Apple Silicon shares unified memory: an M3/M4 Max with 128 GB can run a 70B in INT4 quite comfortably and is one of the best price/perf single-machine setups for local inference.

## B.4 Getting started locally — Ollama

**Ollama** is the easiest way to run open models on your own machine. It's a Go wrapper around llama.cpp with one-line model management and an OpenAI-compatible HTTP API.

### Install

- macOS / Windows: download from `ollama.com`.
- Linux: `curl -fsSL https://ollama.com/install.sh | sh`.

### Run your first model

```bash
ollama run llama3.2
```

That downloads the model (if needed) and drops you in a chat. Type your question, get an answer. Ctrl+D to exit.

### Common commands

```bash
ollama list                  # show installed models
ollama pull qwen3:14b        # download a specific model
ollama run deepseek-r1:8b    # interactive chat
ollama ps                    # show running models / memory use
ollama rm llama3.2           # delete a model
```

### As an API

Ollama exposes an HTTP server (default `http://localhost:11434`) with both a native and an **OpenAI-compatible** endpoint. You can point most LLM tooling at it by setting the base URL.

Native API:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Explain attention in 2 sentences."
}'
```

OpenAI-compatible (works with any OpenAI SDK):

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
resp = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

That `OpenAI` client works with LangChain, LlamaIndex, DSPy, vLLM, and just about everything else — set `base_url` and you're done.

### Modelfile customization

Ollama uses a Dockerfile-like format to make new model configurations:

```
FROM qwen3:14b
PARAMETER temperature 0.6
PARAMETER num_ctx 16384
SYSTEM You are a careful research assistant. Cite sources.
```

```bash
ollama create my-researcher -f Modelfile
ollama run my-researcher
```

Good for distributing prompted setups to your team.

### Performance notes

- Ollama uses GGUF quantized models by default (usually Q4_K_M). Quality is good; for maximum quality pull a higher-precision tag (`:fp16`, `:q8_0`).
- Set `OLLAMA_NUM_PARALLEL` and `OLLAMA_MAX_LOADED_MODELS` to tune concurrency.
- On Apple Silicon, Ollama uses Metal automatically. On NVIDIA, it uses CUDA. On AMD, ROCm.
- For batched / high-throughput serving, **vLLM or SGLang are faster than Ollama**. Ollama optimizes for ease, not throughput.

## B.5 Alternatives to Ollama

**llama.cpp** — the engine Ollama wraps. Use directly when you need finer control:
- Convert HF models to GGUF: `convert_hf_to_gguf.py`.
- Quantize: `llama-quantize model.gguf model-q4.gguf Q4_K_M`.
- Serve: `llama-server -m model.gguf -c 8192 --port 8080`.
- Pure CLI, no Go wrapper, smaller deps.

**LM Studio** — desktop GUI over llama.cpp. Great for non-engineers and quick model browsing. Also exposes an OpenAI-compatible API.

**Jan**, **Open WebUI**, **LibreChat**, **Anything LLM** — open-source ChatGPT-style frontends. Point any of them at Ollama / LM Studio / OpenAI / Claude and chat.

**MLX** (Apple) — native Apple Silicon framework. Faster than llama.cpp on M-series for many workloads.
```bash
pip install mlx-lm
mlx_lm.generate --model mlx-community/Llama-3.2-3B-Instruct-4bit --prompt "Hi"
```

**vLLM** (server-class) — when you want to serve a model to multiple users or get max throughput.
```bash
pip install vllm
vllm serve Qwen/Qwen3-14B --port 8000
```
Also exposes an OpenAI-compatible API.

**SGLang** — similar to vLLM, strong on structured output and prefix sharing.

**Transformers.js / WebLLM** — run models in the browser via WebGPU. Useful for fully-client-side apps.

## B.6 A two-week practical onboarding

If you wanted a concrete way to start, here's a two-week plan that uses everything in this appendix:

**Days 1–2 — Run things.**
- Install Ollama. Run Llama 3.2, Qwen3 8B, DeepSeek-R1 distilled. Compare on a few prompts you care about.
- Hit the OpenAI-compatible API from Python.

**Days 3–4 — Build a small RAG.**
- Pick a corpus (your notes, a documentation site).
- LlamaIndex + Chroma + a BGE embedder + Ollama for generation.
- Add a reranker. Measure quality on 20 hand-written questions.

**Days 5–6 — Fine-tune.**
- Pull a small base model (`Qwen3-4B-Base`).
- Use Unsloth + QLoRA on a small SFT dataset (alpaca, dolly, or your own).
- Compare to base and to Ollama's instruct version.

**Days 7–8 — Add a tool / agent loop.**
- Build a simple ReAct-style loop with two tools (Python execution, web search).
- Use either smolagents or your own ~100 lines.

**Days 9–10 — Eval.**
- Build a 50-question eval set for your task.
- Run with Inspect or Promptfoo across 3 models. Look at failures.

**Days 11–12 — Serve.**
- Move from Ollama to vLLM for throughput.
- Measure TTFT, TPOT, batch scaling.

**Days 13–14 — Observe.**
- Install Langfuse. Trace every call from your agent / RAG.
- Identify and fix one specific failure mode you found.

By the end you'll have hands-on familiarity with the entire stack and a concrete artifact (a working RAG/agent + evals + observability) you can iterate on.

## B.7 Licensing — the boring but important part

Open-weights ≠ open-source ≠ permissive ≠ commercial-use-OK. Categories:

- **Apache 2.0 / MIT**: fully permissive. Mistral (most), Qwen (most), DeepSeek (most), Falcon, OLMo.
- **Llama community license**: free for most, with restrictions on MAU (>700M monthly active users) and limited use-policy clauses.
- **Gemma terms**: free with prohibited-use list.
- **Custom research-only**: some weights are research-only and not commercially usable. Read each release.

For commercial work, **read the license** before deployment. Saying "it's open" doesn't mean you can ship it.

## B.8 What to know about closed frontier models

Even when running open models, knowing the closed leaders matters:

- **Claude** (Anthropic) — frontier reasoning, long context, strong agentic / tool use.
- **GPT-4 / 5 / o-series** (OpenAI) — broad capability, native multimodal.
- **Gemini** (Google DeepMind) — native multimodal, very long context, Google integration.
- **Grok** (xAI), **Mistral Large** (closed releases) — credible alternatives in specific niches.

Patterns of difference:
- Closed leaders typically lead on **agentic reliability** and **frontier reasoning**.
- Open leaders catch up on **general capability** within ~6–12 months.
- Open leaders sometimes lead on **specific axes** (cost-effective coding, multilingual, transparency).

Best practice for products: build behind an abstraction layer that lets you swap providers. Use closed models where they materially win, open models where they're "good enough" and cheaper / more controllable.
