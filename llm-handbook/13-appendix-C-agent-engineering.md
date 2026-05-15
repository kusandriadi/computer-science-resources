# Appendix C — Agent Engineering

If Module 6 is the "what" and "why" of agents, this appendix is the "how" -- the nuts and bolts of making an agent that actually works. Tool design, state management, error recovery, MCP, skills: this is the stuff that separates a demo from a product.

The audience is someone building agents (not just calling them). If you are going through the learning plan, this maps onto Phase 6B.

## C.1 The agent loop, properly

Every agent — Claude Code, Cursor, Devin, your own — is fundamentally this loop:

```
while not done:
    response = model.call(messages, tools=available_tools)
    if response.has_tool_calls:
        for call in response.tool_calls:
            result = execute_tool(call)
            messages.append(tool_result(result))
    else:
        return response.text
```

Everything in this appendix is a refinement of that loop. The interesting questions are:
- **What tools are available** (C.2, C.3)
- **How the model decides what to call** (C.4 planning)
- **How state is managed across iterations** (C.5)
- **How errors are recovered** (C.6)
- **How skills and external knowledge are loaded just-in-time** (C.7)

A 100-line implementation of this loop is genuinely sufficient for most use cases. Frameworks earn their keep only when you need orchestration patterns (parallel sub-agents, durable execution, complex routing) — and even then, hand-rolling is often cleaner than learning a framework's abstractions.

## C.2 Designing good tools

Tool design is the single highest-leverage agent engineering skill. A model with three well-designed tools usually beats the same model with thirty poorly-designed ones.

### Anatomy of a tool

A tool is four things:
1. A **name** the model uses to invoke it.
2. A **description** the model reads to decide whether to invoke it.
3. A **schema** (JSON Schema) for arguments.
4. An **implementation** that runs and returns a result.

The first three are seen by the model; only the last is "real" code. Most failures live in the first three.

### Principles

**Make tools do one thing.** A `manage_files` tool that creates, reads, edits, and deletes is harder for the model to use correctly than four tools (`create_file`, `read_file`, `edit_file`, `delete_file`). Each call is a single decision; the model is better at single decisions than at multi-modal ones.

**Names describe the action, clearly.** `search_documentation` not `lookup`. `run_python` not `execute`. Borderline: `bash` vs `run_shell_command` — `bash` is shorter, well-known, and what models expect.

**Descriptions are mini-prompts.** They are the only place the model learns when to use a tool and when not to. Include:
- What the tool does (one sentence).
- When to use it (and when not to).
- Examples of good and bad invocations.
- Common failure modes.

A good description for a file edit tool:
> Edits a file by replacing an exact string. `old_str` must match the file content exactly (whitespace included) and appear exactly once — if multiple matches exist or the string is not found, this fails. View the file immediately before calling this; do not edit from memory. Use this for surgical changes; use `create_file` to overwrite a file entirely.

**Argument schemas should reject bad calls early.** Required fields, enums where possible, length limits, regex on free-form strings. The model is more reliable when it knows the shape it needs to produce.

**Return useful errors.** "Invalid input" is useless. "old_str matched 3 times in file.py; make it more specific" is what the model needs. A model can recover from a good error; it loops on a vague one.

**Idempotency matters.** Network calls retry. Tools that can be called twice safely (e.g. "create issue" with a client-supplied id) survive retries; tools that can't (e.g. "send email") need explicit confirmation gates.

**Read-only tools are free; write tools are expensive.** Default to read-only. For destructive actions: explicit confirmation, dry-run mode, or write a plan first that the user approves before execution.

**Granularity tradeoff**: too fine-grained means many round-trips and a model that gets lost in mechanics; too coarse-grained means a tool the model can't compose with. Rule of thumb: each tool call should produce information that materially changes what the agent does next. If two tools are always called together, merge them.

### Tool description: a worked example

Bad:
```
search: search the web
```

Better:
```
search: searches the public web and returns a list of (title, url, snippet) results. Use when the user asks about current events, specific facts you're unsure of, or named entities you don't recognize. Do not use for general knowledge questions you can answer directly. Maximum 5 calls per session.
```

Best:
```
search: searches the public web and returns up to 10 results as (title, url, snippet).

When to use:
- Current events or things that change frequently (news, prices, sports scores)
- Specific facts you're not confident about
- Named entities (people, products, places) you don't recognize

When NOT to use:
- General knowledge questions (math, definitions, well-known facts)
- Questions about content already in the conversation
- Anything you can confidently answer in one or two sentences from your training

Tips:
- Short specific queries work better than long ones
- For comparative questions, search both terms separately
- snippets are short; if you need detail, use fetch_url on a promising result

Limits: 5 calls per session. Each call costs ~1s.
```

The latter version "wastes" tokens but reliably saves more in agent loops by reducing unnecessary calls.

## C.3 Tool patterns by category

A non-exhaustive map of tool categories every agent might need, with design notes:

**File operations**: `view`, `create_file`, `str_replace`, `bash`. Almost universal for coding agents. Make `view` show line numbers (the model uses them for `str_replace`). Make `bash` honest about its environment (working directory, available commands, network access).

**Web access**: `search` (query → results), `fetch_url` (url → content). Separate them; the cost profiles differ. For agents that browse, add `click`, `type`, `scroll` (computer use / browser automation).

**Code execution**: a Python REPL or sandbox. Critical for any reasoning/analysis task. Persist state between calls within a session. Stream output for long-running operations.

**Data access**: domain-specific. `query_database`, `read_spreadsheet`, `search_emails`. Give the model schema info up front (table names, column names, types).

**Knowledge / retrieval**: your RAG system as a tool. The agent decides when to retrieve, with what query. Returns chunks with sources.

**Communication**: `send_message`, `create_pr`, `email`. These are destructive — add confirmation gates.

**Memory**: `remember`, `recall` (see C.5).

**Meta-tools**: `ask_user` (when the agent is stuck), `done` (explicit completion signal), `escalate` (hand off to a human or stronger model).

## C.4 Planning patterns

The simplest agent has no explicit plan: each tool call is a local decision. This works for short tasks (1–5 steps). For longer tasks, planning helps.

### Patterns from least to most structured

**Reactive / ReAct** (Yao et al. 2023): thought → action → observation → thought → ... The model reasons in natural language between tool calls. No global plan; just step-by-step. Works well for short to medium tasks.

**Plan-then-execute**: the model produces an explicit plan (a list of steps) before any tool calls, then executes the plan. Two flavors:
- **Rigid**: execute the plan literally; if a step fails, fail the task.
- **Adaptive**: execute step-by-step; revise the plan as new information arrives.
The adaptive version is almost always what you want. The rigid version is brittle.

**Plan-and-solve** (Wang et al. 2023): a refinement that explicitly separates "understand the task" from "produce a plan" from "execute". Useful when the user's request is underspecified.

**Tree of thoughts** (Yao et al. 2023): branch the plan, evaluate branches, prune. Expensive but useful for problems with high uncertainty.

**Reflection / self-critique** (Reflexion, Shinn et al. 2023): after attempting, the agent critiques its own work and revises. Adds latency, often improves quality.

**Orchestrator-worker**: a top-level agent decomposes the task and dispatches sub-tasks to specialized sub-agents (each with their own tool set). Strong pattern for complex work; expensive in tokens.

### When to add planning

Don't add planning until you've observed your agent failing without it. Common signs you need explicit planning:
- The agent gets distracted partway through and forgets the original goal.
- It makes irrecoverable early decisions (deletes the wrong file) that a plan would have caught.
- It loops on local sub-problems instead of moving forward.
- Users complain of unpredictable behavior.

Common signs you have *too much* planning:
- Simple requests get 5-step plans.
- The plan is wrong but the agent executes it anyway.
- Most tokens are spent on planning artifacts, not progress.

## C.5 Context and state management

The agent loop accumulates state: prior tool calls, results, model reasoning. By default, all of it goes back into the model on every iteration. This breaks at scale.

**Compaction**: when the conversation gets long, summarize. Two flavors:
- **Periodic summary**: every N turns, replace older history with a summary. Loses detail but keeps a finite window.
- **On-demand summary**: when approaching the context limit, summarize. Triggered, not periodic.

Compaction is the single most important technique for long-running agents. Claude Code's `/compact` is one example; Cursor's "Composer" similarly summarizes silently.

**Selective context**: instead of summarizing, decide which history is relevant. Keep recent turns + earlier turns relevant to current sub-goal. Harder to get right but preserves more detail.

**Working memory tools**: give the agent explicit `write_memory`/`read_memory` tools. The agent decides what to persist. Powerful but adds another thing for the agent to manage; some agents over- or under-use memory.

**External state**: things that aren't in the conversation but are real (files on disk, branches in git, rows in a database). Give the agent tools to query state. Don't try to mirror it in the conversation.

**Scratchpad files**: for very long tasks, have the agent write notes to a file. Costs nothing in context (it's on disk); the agent reads it back when needed. Effective for multi-hour autonomous work.

## C.6 Error handling and recovery

Agent failures come in flavors:

**Tool returned an error.** Make sure the error is informative (C.2). Most models will retry or revise. Bound retries (typically 3 max) to prevent loops.

**Tool returned the wrong thing silently.** The agent gets back successful-looking data that's actually wrong. Often catastrophic. Mitigations: validate tool results before passing back; add verification tools the agent can use ("check that this worked"); log obsessively.

**Agent gets stuck in a loop.** Same tool, same arguments, same result. Detect this with a simple per-conversation cache; break the loop with a structured nudge: "You've tried that 3 times. Try a different approach."

**Agent forgets the goal.** After many steps, drifts. Mitigations: re-include the original task in the recent context periodically; compaction that preserves the goal verbatim.

**Agent declares done prematurely.** Mitigations: a verifier (separate model call or rule-based) that checks completion against the original task before accepting "done"; an explicit checklist the agent maintains.

**Catastrophic action.** Agent deletes the wrong thing, sends the wrong email. Mitigations: human-in-the-loop confirmation for destructive actions; dry-run mode; reversible operations only (write to a branch, not main; draft, not send).

## C.7 Skills: load-on-demand expertise

A **skill** is a package of instructions + supporting code + reference material that the model loads only when needed. The pattern came out of Anthropic's work on Claude and is increasingly mainstream.

The structure:
```
my-skill/
  SKILL.md           ← instructions (what this is, when to use it, how)
  helpers.py         ← optional reusable code the skill calls
  reference.md       ← optional deeper docs the skill points to
  examples/          ← optional worked examples
```

The model is given only the skill's *metadata* (name + short description) by default. When relevant, it reads `SKILL.md`. From there, it can navigate into other files in the skill folder.

### Why this works

The context window is precious. Loading every possible instruction up front wastes it on irrelevant content for the current task. Loading none means the model improvises and gets things wrong on domain-specific work. Skills compromise: the *index* is always loaded; the *content* is loaded on demand.

### When to use a skill vs alternatives

| You want... | Use... |
|-------------|--------|
| Always-active behavior | System prompt |
| Domain knowledge for one task class | Skill |
| The model to reliably produce a behavior it can't reliably produce now | Fine-tuning |
| Real-time data | RAG / tool |
| Reusable code | Tool (with skill describing how to use it) |

Skills shine for: document creation (a "PDF skill" with examples and templates), data analysis recipes, domain SOPs, complex tool usage patterns, anything that's stable and reusable across sessions.

### Writing a good skill

**Frontmatter**: name, description (read by the model before loading). The description should be specific about *when* the skill applies. Bad: "for PDFs." Good: "Use whenever the user wants to read, fill, merge, split, watermark, or extract content from PDF files."

**SKILL.md body**: instructions like a senior teammate would write for a junior. Worked examples beat abstract rules. Anti-patterns ("don't do X, because Y") are valuable.

**Supporting files**: don't try to fit everything in SKILL.md. Put reference material in separate files and tell SKILL.md to load them when needed. This is the load-on-demand benefit.

**Composability**: skills should declare what *other* skills they complement (e.g. a "fill PDF form" skill that references a "read PDF" skill). Models follow the trail.

### Distribution

Skills travel as folders. They can be:
- Shipped with the model platform (built-in skills).
- Loaded from a directory the user controls (`/.claude/skills/`).
- Distributed as packages (npm, pip, dedicated registries) and installed.

The format is portable across model providers in principle, though specific tooling varies.

## C.8 MCP — the Model Context Protocol

Tools and skills are *what* an agent uses. **MCP** is *how* those tools and skills are wired in.

### The problem MCP solves

Pre-MCP, every tool integration was N×M: every agent client (Claude Desktop, Cursor, your custom app) had to integrate every tool source (GitHub, Slack, your internal DB) separately. That doesn't scale.

MCP defines a small set of standard verbs (`tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`) that any *client* can speak to any *server*. A new tool source just needs to expose an MCP server; every MCP-compatible client gets it for free.

### Architecture

Three roles:
- **Host**: the application the user interacts with (Claude Desktop, Cursor, etc.).
- **Client**: the part of the host that connects to one MCP server.
- **Server**: a process that exposes tools/resources/prompts. Usually a separate program.

A single host typically runs many clients in parallel, each talking to a different server.

### What MCP servers expose

**Tools**: functions the model can call. Same shape as native tools (name, description, schema, output).

**Resources**: read-only data the model can fetch (files, database rows, API responses). Identified by URIs.

**Prompts**: parameterized prompt templates the user can invoke (think: slash commands).

A good server might expose all three. A simple server might expose just tools.

### Transports

- **stdio**: the server is a subprocess; client and server talk over stdin/stdout. Best for local tools.
- **HTTP / SSE / Streamable HTTP**: for remote servers. Used for hosted integrations.
- **WebSocket**: less common, occasionally used.

For local development, stdio is easiest. For team-shared servers, HTTP.

### Building an MCP server (sketch)

The official SDKs (`@modelcontextprotocol/sdk` for TS, `mcp` for Python) handle most of the protocol. A minimal Python server:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Adds two numbers."""
    return a + b

@mcp.resource("config://settings")
def get_settings() -> str:
    """Returns app settings."""
    return open("settings.json").read()

if __name__ == "__main__":
    mcp.run()
```

That's a working MCP server. Any MCP-compatible client can connect and use these.

### Security

MCP servers run with the user's privileges. A malicious server (or a compromised one) can do anything the user can do. Practical guidelines:
- Treat MCP servers like browser extensions: install ones from trustworthy sources.
- Prefer servers that declare scope (read-only, specific resources).
- For sensitive servers, run in a sandbox.
- For agents that consume MCP tools, defend against prompt injection in tool *outputs* — a malicious server can return content designed to manipulate the agent.

### Where MCP is going (2026)

- Becoming the default integration surface across providers (Anthropic, OpenAI, Google).
- Growing ecosystem of community servers (GitHub, Slack, Postgres, Notion, etc.).
- Standard authentication patterns emerging (OAuth flows for hosted servers).
- Skills and MCP are converging — skills can be MCP-distributed; servers can ship skills.

If you're building an agent or a tool platform: support MCP. It's the closest the field has to a standard.

## C.9 "Plugins" — historical context

OpenAI introduced "Plugins" in early 2023: a way for ChatGPT to call external APIs described by an OpenAPI spec. The architecture (advertise capabilities, model decides to call) is the conceptual ancestor of modern tools and MCP.

Plugins were deprecated in 2024 in favor of:
- **Function calling / tools** (native model capability) — replaced the calling mechanism.
- **GPTs / Custom GPTs** — replaced the user-facing configuration.
- **Actions** in GPTs — replaced the API-binding part.
- **MCP** — now subsuming all of the above as the cross-vendor standard.

So if you're reading older material about "plugins": that's mostly equivalent to today's tools + MCP. The name changed; the idea didn't.

A few useful lessons from the plugin era that still apply:
- Models need rich descriptions to choose tools well. OpenAPI specs were not rich enough; descriptions had to be embellished.
- Authentication is the hardest part of any tool integration.
- The "appstore" model (a directory of plugins users browse) was less useful than tools the user installs deliberately. Discoverability turned out to be a smaller problem than reliability.

## C.10 Putting it together: an agent stack

A modern agent system, layered:

```
┌──────────────────────────────────────────┐
│  Host / app (UI, user-facing)            │
├──────────────────────────────────────────┤
│  Agent loop                              │
│    - Planning pattern (C.4)              │
│    - Context management (C.5)            │
│    - Error recovery (C.6)                │
├──────────────────────────────────────────┤
│  Skills (loaded on demand) (C.7)         │
├──────────────────────────────────────────┤
│  Tools                                   │
│    - Native tools (built into the agent) │
│    - MCP tools (from MCP servers) (C.8)  │
├──────────────────────────────────────────┤
│  Model (API or local)                    │
└──────────────────────────────────────────┘
```

Where each layer should live:
- The **host** is your product. Build to what users need.
- The **agent loop** is your code. Aim for ~500 lines. Resist the urge to use a framework until you've felt its absence.
- **Skills** are versioned in a directory; can be team-shared.
- **Tools** are split: a few critical ones built natively (fast, reliable, well-understood); long tail via MCP servers (convenient, swappable).

## C.11 Examples from real systems

A few production agents and what makes them work, briefly:

**Claude Code**: file-editing agent for software engineering. Small tool set (view, edit, bash, ~5 others). Skills for specific document/format expertise. Heavy use of `/compact` for long sessions. MCP for external integrations. Reads from `CLAUDE.md` files for repo-specific guidance.

**Cursor / Composer**: code completion + agentic edits. Tight loop between editor state and model. Silent summarization. Custom tools for codebase indexing.

**Aider**: terminal-based coding agent. Excellent example of small-and-sharp. Repo map as context; git-aware; small tool set; focused on iteration.

**Devin / OpenHands**: long-running autonomous coding agents. Heavier orchestration; sub-agents; longer plans. The bet that more autonomy wins.

**Operator / Browser agents**: tool set is the browser primitives (click, type, scroll, screenshot). Vision capability is critical. Slow, but applicable to anything with a UI.

The pattern: each successful agent picks a domain narrow enough that tool design is tractable, then makes those tools excellent. Generality is harder than it looks.

## C.12 Things that don't work (yet)

A short list of things that *sound* like they should work but mostly don't, as of 2026:

- **Fully autonomous "do my job" agents**. Tasks that need multi-day uninterrupted work with no checkpoints. Models drift; errors compound.
- **Massive tool counts**. Past ~50 tools, models start choosing badly even with good descriptions. Splitting into orchestrator + specialized sub-agents helps.
- **Pure-prompt agents on weak models**. A 7B model with a great prompt can't replicate what a frontier model with a mediocre prompt does. Capability gaps in the base model are not closed by prompting.
- **Plan-once execution**. Plans must adapt; rigid plans fail on contact with reality.
- **Letting the agent design its own tools mid-run**. Sounds powerful; in practice the tools it designs are worse than ones you'd write deliberately.

## C.13 Exercises

1. Take an agent you have (or build one in ~200 lines). Audit its tool descriptions. Rewrite the worst three using the principles in C.2. Measure success-rate change on your eval set.
2. Build an MCP server that exposes one tool you care about. Connect it to Claude Desktop or Cursor. Use it for a day. Note what you'd change.
3. Write a skill for a task you do repeatedly (a document format, a domain SOP, a coding pattern). Test it by giving a fresh agent the skill and seeing if it succeeds without further prompting.
4. Add compaction to your agent's loop. Run a 30-turn conversation. Compare quality and cost with and without compaction.
5. For your agent, implement two planning patterns (reactive and plan-then-execute) and pick a task class for each. Verify that the right pattern wins on its own class.

## C.14 Further reading

- *Building Effective Agents* — Anthropic engineering guide. The most-cited modern reference.
- Model Context Protocol spec — modelcontextprotocol.io. Authoritative source.
- *Computer Use* (Anthropic 2024) — agent operating a real computer; tool design under uncertainty.
- *Plan-and-Solve Prompting* — Wang et al. 2023.
- *ReAct* — Yao et al. 2023.
- *Reflexion* — Shinn et al. 2023.
- *Toolformer* — Schick et al. 2023. Earlier influential work on tool learning.
- Source code: Claude Code SDK, smolagents, LangGraph, Aider — different points in the design space, all worth reading.
