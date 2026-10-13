# MythSplicer

**Every choice leaves a trace.**

An original, MIT-licensed, local-first adventure engine for human and AI participants. This first development slice is **The Bellweather Chronicle**, a playable browser demo.

## Playable now (after PR merge + Pages deployment)

- Three linked locations, three scripted town NPCs, and three investigable clues.
- Deterministic world reducer and seeded d20. No language model owns canonical state.
- Event ledger plus browser-local save via localStorage, with an explicit reset.
- Experimental PocketBrain Tiny browser client loaded **only on user click**. The model can produce in-character NPC dialogue or non-canonical atmospheric narration. Outputs never add items, roll dice, change relationships, or enter the canon ledger.
- React/Vite UI, CI and Pages deployment workflow (base path /MythSplicer/).

Proposed public site: https://michaelwave369.github.io/MythSplicer/

## Running locally

    npm install
    npm test
    npm run dev
    npm run build

The authoring environment could not reach the npm registry. This initial PR has no generated lockfile, and CI uses npm install. **A resolved dependency lockfile plus switching CI to npm ci is a required follow-up gate**, not a hidden promise of reproducibility.

## PocketBrain Tiny: provenance and privacy

Experimental SDK: https://github.com/MichaelWave369/PocketBrain/blob/main/public/sdk/v0.1/index.mjs

The current SDK is a candidate, not a released immutable package or production-verified integration. It dynamically uses a real pretrained ONNX SmolLM2-135M-Instruct derivative. Clicking Load imports JS from PocketBrain GitHub Pages, and calls load() to fetch Transformers.js runtime code from jsDelivr and ONNX/tokenizer artifacts from Hugging Face. Loading requires explicit consent, internet for a first load, and substantial browser resources. Once initialized, model generation runs in-browser, with no automatic remote inference fallback. Model and runtime licenses are distinct from this application's MIT license.

The model is **pretrained**, not a custom fine-tuned game-master brain. NPC traits currently condition prompts; the application tracks simple affinity as local state. Neither mechanism trains or changes neural weights. Generated responses are displayed as untrusted plain text and clearly labeled NON-CANON, with PocketBrain's self-reported run receipt available.

The current demo does **not** offer autonomous AI player turns, multiplayer, secret knowledge ACLs, semantic memory, branchable histories or trained NPC specializations. These are future gates.

## Roadmap

1. Frozen canonical event protocol, replay verification, export/import.
2. Governed AI player proposals: propose, validate, review, commit.
3. Character-specific memory, secrets and information partitions.
4. Adaptive model seating: deterministic NPC routines, shared PocketBrain Tiny inference, Ollama/LM Studio local adapters, explicit cloud option.
5. Optional fine-tuning with licensed/consented data, benchmarks and model cards.
6. Campaign editor, branching worlds and multiplayer synchronization.

See docs/ARCHITECTURE.md for privacy, trust and system boundaries.

Copyright 2026 Michael Hughes. MIT license.
