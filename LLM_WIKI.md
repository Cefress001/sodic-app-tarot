# LLM Wiki Operating Schema

This repository can be used as an LLM-maintained personal knowledge base. The LLM owns the generated wiki layer, while humans curate source material and direct the investigation.

## Directory model

- `raw/` contains immutable source material selected by the human.
  - `raw/sources/` stores source documents such as clipped articles, notes, transcripts, PDFs converted to markdown, or data files.
  - `raw/assets/` stores local images and attachments referenced by source documents.
- `wiki/` contains LLM-generated markdown pages.
  - `wiki/index.md` is the content-oriented navigation catalog.
  - `wiki/log.md` is the chronological activity record.
  - `wiki/overview.md` summarizes the current shape of the knowledge base.
  - `wiki/sources/` stores one summary page per ingested source.
  - `wiki/entities/` stores pages for people, organizations, places, projects, products, characters, or other named entities.
  - `wiki/concepts/` stores reusable topic and concept pages.
  - `wiki/analyses/` stores synthesized answers, comparisons, reports, and other query outputs worth preserving.
  - `wiki/templates/` stores page templates.

## Core principles

1. Treat raw sources as the source of truth. Do not modify files in `raw/` unless the human explicitly asks.
2. Keep the wiki persistent and compounding. New information should update existing pages instead of creating isolated summaries only.
3. Prefer links over repetition. Use Obsidian-style wiki links such as `[[Concept Name]]` when connecting pages.
4. Record provenance. Every non-trivial claim should point back to a source summary or source file when practical.
5. Surface uncertainty. Note contradictions, stale claims, weak evidence, and open questions instead of smoothing them over.
6. Preserve useful conversations. If a query produces durable synthesis, file it under `wiki/analyses/` and link it from the index.

## Ingest workflow

When asked to ingest a source:

1. Identify the raw source path and read it fully enough to understand its argument, evidence, entities, and reusable concepts.
2. Create or update a source summary in `wiki/sources/` using `wiki/templates/source-summary.md`.
3. Update relevant entity and concept pages. Create new pages only when the topic is likely to recur.
4. Update `wiki/overview.md` if the source changes the overall synthesis.
5. Update `wiki/index.md` with new or materially changed pages.
6. Append a dated entry to `wiki/log.md` using the format `## [YYYY-MM-DD] ingest | Source Title`.
7. Report what changed and highlight contradictions or follow-up questions.

## Query workflow

When asked a question about the knowledge base:

1. Read `wiki/index.md` first to identify likely relevant pages.
2. Read the relevant wiki pages and, when necessary, the underlying raw sources.
3. Answer with citations to wiki pages or raw source files.
4. If the answer is likely to remain useful, ask whether to file it or directly create a page in `wiki/analyses/` when instructed.
5. Update `wiki/index.md` and `wiki/log.md` when a durable analysis page is added.

## Lint workflow

When asked to lint or health-check the wiki:

1. Look for orphan pages, missing backlinks, duplicate pages, and important uncreated concepts.
2. Check for contradictions between source summaries, concept pages, and overview claims.
3. Identify stale claims superseded by newer sources.
4. Suggest new sources or searches that would improve weak areas.
5. Append a dated `lint` entry to `wiki/log.md` summarizing findings and fixes.

## Page conventions

- Use concise, descriptive filenames in kebab case, for example `wiki/concepts/persistent-synthesis.md`.
- Include YAML frontmatter on generated wiki pages.
- Use `status: draft`, `status: active`, or `status: needs-review`.
- Use `updated: YYYY-MM-DD` whenever a page is materially changed.
- Keep backlinks in a `Related` section where useful.
- Keep source-backed claims separate from interpretation when possible.

## Log format

Use consistent second-level headings so the log is easy to parse:

```md
## [2026-06-27] ingest | Example Source Title
- Source: `raw/sources/example.md`
- Updated: `wiki/sources/example.md`, `wiki/concepts/example-concept.md`
- Notes: Key changes, contradictions, and follow-ups.
```
