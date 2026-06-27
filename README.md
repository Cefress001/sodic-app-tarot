# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## LLM Wiki scaffold

This repository also includes an optional LLM Wiki scaffold for building a persistent, LLM-maintained knowledge base alongside the app.

- Read `LLM_WIKI.md` for the operating schema and workflows.
- Put immutable source material in `raw/sources/` and attachments in `raw/assets/`.
- Let the LLM maintain generated pages under `wiki/`, starting with `wiki/index.md` and `wiki/log.md`.
