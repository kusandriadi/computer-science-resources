# Appendix F — Enterprise LLM Use Cases

Every domain thinks its LLM needs are unique. They are not -- most enterprise deployments end up looking surprisingly similar at the architecture level. This appendix covers real corporate use cases (tax, HR, legal, finance, compliance, customer ops) with the patterns that actually work. The goal is to skip the "AI can do anything!" hype and get to "here is exactly what to build, in what order, with what mitigations."

Every section follows the same structure: **what the use case is**, **what works**, **what fails**, **architecture**, **deployment notes**.

## F.1 The cross-cutting pattern

Almost every successful enterprise LLM deployment looks similar at the architecture level:

1. **Document corpus** (policies, contracts, regulations, internal SOPs) → ingested, chunked, indexed.
2. **RAG layer** retrieves relevant context per query.
3. **LLM with tight prompt** synthesizes answer constrained to retrieved content.
4. **Citation requirement** — every claim links back to source.
5. **Human-in-the-loop** for any consequential output (advice, action, decision).
6. **Audit trail** — every query and response logged for compliance.
7. **Eval set** built from real user questions, scored regularly.

The variations between use cases are mostly: which documents go in, what level of authority the output has, what regulations constrain the deployment.

This pattern is boring on purpose. Enterprise LLM is not where you experiment with new architectures — it's where you ship reliable systems on top of well-understood patterns.

## F.2 Tax — case study

**What it is**: assistant for tax accountants or in-house tax teams. Answer questions like "what's the depreciation treatment for X under new regulation Y?", "draft a position memo on transaction Z", "summarize changes in the latest tax update".

**What works**:
- Q&A grounded in tax code, regulations, internal interpretations, and prior memos.
- First-draft generation of routine documents (transfer pricing reports, position memos, client letters).
- Tax research acceleration — finding relevant rulings and precedents.
- Reconciliation and exception explanation in tax data.

**What fails**:
- Unsupervised tax advice. Hallucination risk too high; regulations change frequently.
- Numerical computation done by the LLM directly. Always offload to tools (Python, spreadsheet, tax engine).
- Cross-jurisdiction reasoning without explicit context. Models conflate regimes.
- "Tell me my tax liability." Real liability depends on facts the LLM doesn't have access to.

**Architecture**:
- **Corpus**: tax code (federal, state, local), regulations, revenue rulings, court decisions, OECD guidelines (for international), firm's internal interpretation memos, prior client work product (with proper access control).
- **Retrieval**: hybrid (vector + BM25). Citation by source and date is critical. Reranker tuned on tax-specific relevance.
- **Generation**: model prompted with "answer only from retrieved sources; cite paragraph numbers; flag if sources conflict; flag if regulation may have been superseded".
- **Tools**: tax engine integration (Vertex, Avalara, internal calculators) for any computation. The LLM never does arithmetic on tax matters directly.
- **Verification**: every numerical claim must come from a tool, not the model. Every legal claim must cite a source.

**Deployment notes**:
- Effective dates matter enormously. Index documents with valid-from/valid-to metadata; filter retrieval by query date.
- Output disclaimer: "Draft for review by a qualified tax professional. Not tax advice."
- Per-jurisdiction segregation in the corpus. A US tax query should not retrieve UK content unless explicitly cross-border.
- Periodic re-indexing on regulatory updates. Major tax reforms (annual budgets, OECD pillar implementations) require careful staging.

**Risks specific to tax**: a wrong answer is not just a UX problem — it can mean penalties, restated returns, or professional liability claims against the firm. Human review of any client-facing output is non-negotiable.

## F.3 HR — case study

**What it is**: assistant for HR teams or as employee-facing tool. Common asks: "how does our parental leave policy work?", "draft a job description for X role", "summarize this candidate's interview feedback", "what's the process for an internal transfer?".

**What works**:
- Policy Q&A — turning a 200-page handbook into instant answers.
- Drafting routine documents — job descriptions, performance review summaries, offer letters.
- Summarizing interview/360 feedback into themes.
- Onboarding navigation — answering "where do I go for X?" for new hires.
- Skill matching for internal mobility (with care).

**What fails**:
- Compensation recommendations. Bias risk; pay equity is a legal issue.
- Performance evaluation as a standalone output. Models inherit reviewer biases and amplify them.
- Candidate screening or ranking without auditability. Regulatory minefield (EU AI Act, NYC AEDT, etc.).
- Anything touching protected categories (age, race, gender, disability, religion). Even if the model has data, it must not use it.
- Conflict resolution / disciplinary reasoning. Required to be human-led.

**Architecture**:
- **Corpus**: employee handbook, benefits documentation, policy memos, country-specific employment law summaries, internal SOPs, manager guides.
- **Retrieval**: standard RAG. Heavy metadata for country/region/role (a Berlin engineer's parental leave is different from a Singapore PM's).
- **Generation**: strict grounding. Prompt explicitly forbids extrapolation beyond cited policy. "If the policy doesn't address this, say so — don't guess."
- **Access control**: critical. Manager-only documents must not surface to ICs. Salary band documents must not surface to individuals asking about themselves. Document-level ACLs feed into retrieval filters.
- **Sensitive routing**: queries that pattern-match on disciplinary, harassment, discrimination, mental health, etc. → routed to human HR. Do not generate; instead provide contact info and escalation path.

**Deployment notes**:
- Maintain a sensitive-topic classifier as a layer in front of generation. Route detected sensitive queries away from the LLM.
- Logs may need special handling. HR-related conversations might fall under employment record retention; check with employment counsel.
- Bias evaluation: regularly probe with paraphrased queries that vary only on protected characteristics. The system should produce identical answers.
- EU AI Act consideration: employee-facing systems used in hiring, promotion, or termination are likely "high-risk" under the Act. Compliance is non-optional.

## F.4 Legal — case study

**What it is**: assistant for in-house counsel, law firms, contract teams. Tasks: contract review, clause extraction, redlining, legal research, regulatory tracking, case summarization, due diligence document review.

**What works**:
- Contract analysis — identifying clauses (liability, termination, IP, indemnity), comparing to standards.
- Redlining first drafts against playbooks.
- Document review at scale (e.g. M&A due diligence, eDiscovery first-pass).
- Legal research — finding relevant case law, statutes, regulations.
- Summarization of long documents (briefs, opinions, regulatory filings).
- Drafting routine documents (NDAs, basic agreements, demand letters) for human review.

**What fails**:
- Final-form legal advice without attorney review. Unauthorized practice of law, malpractice exposure.
- Citation generation from memory. Hallucinated cases have caused court sanctions in real cases. Always retrieve and verify.
- Litigation strategy or risk assessment as autonomous output.
- Privileged information handling without strict controls. Privilege can be waived through careless handling.

**Architecture**:
- **Corpus**: applicable statutes, regulations, case law (jurisdiction-specific), firm or company playbook, prior contracts (with access controls), legal opinions, regulatory guidance.
- **Citation enforcement**: this is the single most important component. Every legal proposition in output must trace to a retrieved source. Output verification step: parse claimed citations, check against retrieved chunks, reject the response if any citation can't be verified.
- **Retrieval**: hybrid with jurisdiction filtering. Cross-references between cases handled by a graph index ideally.
- **Generation**: explicit prompting against extrapolation. Quote when possible, paraphrase with citation otherwise.
- **Document analysis pipeline**: chunk → classify (clause type) → extract structured fields → compare to standard → generate redlines. Each step is auditable.

**Deployment notes**:
- Privilege markings on documents must propagate through the pipeline. Privileged content must not be mixed into non-privileged contexts.
- Conflicts checking — for law firms, ensure documents from different client matters aren't co-mingled.
- Retention policies vary by jurisdiction and matter type. Logs may be discoverable.
- ABA Model Rules and equivalent professional conduct rules apply. Some bar associations have issued specific guidance on AI use.
- The hallucinated-citation problem is so severe that some firms maintain a separate "citation verification" service that hits actual legal databases (Westlaw, Lexis) to confirm every cited case exists and says what the model claims.

**Risk specific to legal**: a wrong citation has caused actual court sanctions and firm reputation damage. A wrong contract redline can mean millions in disputed terms. Citation verification and human review are not optional.

## F.5 Finance / Accounting — case study

**What it is**: assistant for finance teams, FP&A, controllers, accounting operations. Tasks: variance analysis, journal entry generation, expense report processing, financial document Q&A (10-Ks, MD&A), forecasting commentary, reconciliation explanation.

**What works**:
- Variance commentary — "explain why opex was 8% over budget" from data + context.
- Journal entry drafting (for human approval) from descriptions.
- Q&A over financial documents and accounting policies.
- Expense report classification and policy compliance checking.
- Reconciliation discrepancy explanation.
- Investor relations document drafts (earnings narratives, press releases).

**What fails**:
- Direct accounting determinations. Revenue recognition, lease classification, etc. are auditor territory.
- Anything that touches material reporting numbers without explicit human sign-off (SOX implications).
- Forecasting on its own. Use the LLM to explain forecasts, not to make them.
- Anything insider-information-adjacent before public release.

**Architecture**:
- **Tools, not generation**, for numbers. LLM never reads or generates a number that isn't sourced from a deterministic tool (database query, spreadsheet calculation, ERP report).
- **Corpus**: accounting policies (internal + GAAP/IFRS), chart of accounts documentation, prior period commentaries, internal control documentation.
- **Retrieval + structured data**: text retrieval for policy; SQL/API tool calls for numerical data.
- **Generation**: narrative around numbers, with strict prompting that all numerical claims come from tool output.

**Deployment notes**:
- SOX controls: any system that influences financial reporting needs documented controls, change management, access reviews, separation of duties.
- Material non-public information (MNPI) handling: pre-earnings data must be tightly controlled. Don't let the LLM see what humans wouldn't.
- Audit trail: every numerical claim → tool call → underlying data, fully traceable.
- Quarter-close and audit periods often need a freeze on system changes.

## F.6 Compliance / Risk — case study

**What it is**: assistant for compliance, risk, internal audit teams. Tasks: regulatory change monitoring, policy compliance Q&A, control testing automation, suspicious activity drafting, KYC/AML triage support.

**What works**:
- Regulatory horizon scanning — summarizing new rules and flagging applicability.
- Policy Q&A for employees ("can I accept this gift?", "is this transaction reportable?").
- Drafting first-pass narratives for suspicious activity reports (human reviewed).
- Control testing aid — extracting evidence from documents to support control assertions.
- Sanction screening exception explanation.

**What fails**:
- Final compliance determinations. Always human-decided.
- Risk scoring as autonomous output, especially with regulatory implications (AML risk, credit risk).
- Anything that could constitute legal advice (overlap with §F.4).

**Architecture**: similar to legal and tax. Heavy citation, strict grounding, human approval gates on anything that triggers reporting or escalation.

**Deployment notes**:
- Many compliance use cases (AML, sanctions) are heavily regulated. Model explainability and auditability are requirements, not nice-to-haves.
- Regulator dialogue: be prepared to explain to a regulator (Fed, OCC, FCA, MAS, etc.) how the system works, what it decides, and what humans control.
- Don't use generic prompting for SAR drafting; use structured templates with strict required fields.

## F.7 Customer operations — case study

**What it is**: customer support automation, agent assist, knowledge base Q&A, ticket routing/summarization.

**What works**:
- Tier-1 customer Q&A on documented topics (products, policies, account info with auth).
- Agent assist — surfacing relevant articles and drafting responses for human agents to send.
- Ticket summarization and classification.
- Translation and tone adjustment.
- Post-call summary and CRM update generation.

**What fails**:
- Fully autonomous resolution of complex or sensitive issues. Customer frustration with bad bots is real and creates churn.
- Anything involving account changes (refunds, cancellations, security actions) without verification and audit.
- Cross-channel context loss. If the customer mentioned X on a prior call, the system should know.

**Architecture**:
- **Corpus**: help center, KB articles, product docs, policy documents, prior tickets (with PII redaction or controlled access).
- **Tools**: CRM read/write (carefully scoped), order/account lookup, action APIs (refund, cancel, etc.) with confirmation gates.
- **Authentication**: tying the conversation to a verified customer identity. Action authorization is separate from authentication and must be enforced server-side regardless of what the LLM "decides".
- **Escalation paths**: clear triggers for human handoff (sensitive content, repeated failure, customer request, high-value account).

**Deployment notes**:
- Recordings/transcripts retention varies by jurisdiction (consent requirements, length).
- PCI-DSS for any payment-info-adjacent system.
- Telecommunications regulations (TCPA in US, etc.) for outbound communications.

## F.8 Software engineering — case study

**What it is**: code assistance, code review, documentation, internal developer Q&A. Often deployed across the engineering org.

**What works**:
- IDE-integrated code completion and edit (Cursor, Copilot, Claude Code patterns).
- Code review on PRs — flagging issues, suggesting improvements.
- Documentation generation and maintenance.
- Internal Q&A — answering "how do I deploy service X?" from internal docs.
- Test generation, especially for new code.
- Onboarding — explaining unfamiliar codebases.
- Incident triage and log analysis.

**What fails**:
- Autonomous merging without review. Quality and security risk too high.
- Production access without controls. Read-only by default; write actions need approval.
- Customer-data access by dev tools. Engineers' AI assistants shouldn't see customer PII.

**Architecture**:
- **Corpus**: internal docs, runbooks, code repositories, ADRs, post-mortems.
- **Tools**: code search, log search, metric queries, build/test execution (sandboxed).
- **Per-repo or per-service indices** for codebase Q&A.
- **Skills** (Appendix C) for specific domains (security, performance, accessibility patterns).

**Deployment notes**:
- IP and license: training data and outputs may have licensing implications. Most enterprise deployments use models with clean IP indemnification or avoid copyrighted code in training.
- Secrets in code: scan retrieved chunks for secrets before generation. Never let secrets surface in answers.
- Air-gapped environments: some defense/finance/healthcare engineering needs on-prem models.

## F.9 Sales and marketing — case study

**What it is**: lead research, email drafting, content generation, RFP response support, CRM enrichment.

**What works**:
- Lead research and summary from public sources.
- Personalized email drafting (with sales rep review).
- RFP response acceleration — finding prior answers, drafting responses.
- Content variants and A/B test generation.
- Meeting summarization and follow-up drafting.
- CRM data enrichment and cleanup.

**What fails**:
- Mass automated outreach without quality control. Spam complaints, deliverability damage.
- Public-facing content without human review. Brand and accuracy risk.
- Competitor information sourcing without IP/ethics review.

**Architecture**: lighter on RAG (less compliance-critical), heavier on integration (CRM, marketing automation, email).

**Deployment notes**:
- GDPR/CCPA for any lead data handling.
- Email regulations (CAN-SPAM, CASL, GDPR consent) for outreach.
- Brand consistency: a style guide as a skill or system prompt.

## F.10 The build sequence for a new enterprise LLM project

A pragmatic order of operations regardless of domain:

**Week 1–2 — Discovery**:
- Identify the actual user (not "the business"; an actual person with a real job).
- Watch them work. Note the questions they ask, the documents they reference.
- Build a list of 30–50 real example queries with known good answers.

**Week 3–4 — Baseline RAG**:
- Ingest the corpus (start minimal — the 5 most important documents).
- Stand up basic RAG with a frontier API.
- Run against your example queries. Measure correctness.

**Week 5–8 — Refinement**:
- Iterate on chunking, retrieval, reranking, prompting.
- Add citation requirements and verification.
- Build the eval set into CI.
- Pilot with 3–5 real users.

**Week 9–12 — Hardening**:
- Sensitive-topic routing.
- Access controls aligned to source documents.
- Audit logging.
- Performance and cost tuning.
- Security review.

**Week 13+ — Production**:
- Roll out to a single team first.
- Gather feedback for 4–6 weeks before expanding.
- Continuously monitor and improve. Expect to find a meaningful issue every week for the first quarter.

## F.11 Cross-cutting deployment patterns

A few patterns that apply across most enterprise use cases:

**The Confluence/SharePoint problem**: enterprise document stores are messy. The "corpus" you index is full of out-of-date drafts, duplicates, contradictions. Investment in document curation has 5–10× return over investment in retrieval tuning.

**Version everything**: prompts, models, retrievers, eval sets. Roll back when things degrade. (Module 8.)

**Run two models**: a fast/cheap one for triage, a strong one for hard cases. Saves cost without hurting quality. (Module 8 §8.5.)

**Build the eval before the system**: 30–50 hand-curated example queries with known good answers, gathered from the actual users, before you write any code. This is the single highest-leverage thing you can do.

**Make the source visible**: every claim in every answer cites a document. Users will trust the system more *and* will catch issues faster.

**Plan for the regulator**: if you might ever need to explain this system to a regulator, auditor, or counsel, build it that way from day one. Auditable decisions, traceable inputs, frozen versions.

**Don't underestimate change management**: the technology is rarely the hardest part. Getting people to actually use the system, trust it appropriately, and integrate it into workflow is.

## F.12 Regulations to know

Not legal advice — but as of 2026 these come up in nearly every enterprise LLM deployment:

- **EU AI Act**: risk-tiered. High-risk categories include employment, education, essential services. Compliance phasing through 2026–2027.
- **GDPR / UK GDPR / state-level US privacy laws**: data minimization, purpose limitation, consent. Affect what you can put in your corpus and how you log.
- **HIPAA** (US healthcare): protected health information needs BAA-covered handling.
- **SOX** (US public companies): controls over financial reporting systems.
- **PCI-DSS**: payment card information.
- **FINRA / SEC**: financial services communication and supervision requirements.
- **Bar association / professional rules** for legal use.
- **Sector-specific**: telecommunications, energy, defense all have their own regimes.
- **Region-specific AI laws**: emerging in China, Brazil, Canada, Australia, Singapore, others. Tracking is now a real workload for compliance teams.

Always confirm with counsel before production deployment in regulated contexts.
