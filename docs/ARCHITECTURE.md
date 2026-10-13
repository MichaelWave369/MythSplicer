# MythSplicer Architecture — first slice

## Rule engine versus language model

The source file src/game.ts is a pure deterministic reducer. Valid game actions are travel, examine, talk and roll. The rules decide state changes and append events to the canonical ledger. No AI module has direct access to this reducer or browser storage. The game uses a seeded deterministic *demo* d20; it is not cryptographically secure or suitable for gambling.

## Model adapter boundary

The browser does not import external model code at startup. Clicking **Load real local model** dynamically imports PocketBrain's experimental SDK module at /PocketBrain/sdk/v0.1/index.mjs. The SDK's load() is also called only after this click, fetching Transformers.js from jsDelivr and a pretrained SmolLM2 ONNX model/tokenizer from Hugging Face. This can fail on an incompatible device or network, and is not offline on the first load. There is no automatic cloud provider fallback.

The SDK wrapper is version-labeled but still imports mutable upstream files. Exact model revisions/checksums are not pinned or verified. This is exploratory cross-app consumption, **not** proof of production readiness, independent pretrained weight parity, mobile support, or stable SDK packaging. Model receipts are self-reported.

Prompt inputs are the selected scene, public clues, and public role personality. Outputs are displayed as React text and NOT promoted to canon. No secret NPC knowledge is modeled at this stage.

## Personalization and training are different

- *Rule weighting*: deterministic priorities and personality parameters controlled by the game.
- *Prompt conditioning*: telling a pretrained model to speak as an NPC.
- *Persistent memory*: stored observations with provenance, permissions and expiry.
- *Weight training*: changing a neural model through a legitimate training process, requiring datasets, weight provenance, model cards and evaluation.

Only the first two are demonstrated here; no model fine-tuning occurs.

## Future security and agency gates

Model-controlled actors should produce strictly typed proposals limited to legal actions, with actor identity, allowed knowledge, cost ceilings and reproducible receipts. A validator or explicit human approval commits through the same deterministic engine. NPC memory must keep private knowledge separate from player-visible context. Timelines should branch without overwriting historical receipts.

## Local data

The story save uses plaintext localStorage on the MythSplicer origin. This is convenient, not encrypted or durable backup. No analytics are deliberately added. Do not store secrets. Browser networking to the SDK/runtime/model provider still reveals normal request metadata to those hosts.

## Verification limits

Unit tests cover world state invariants and the d20 range. Real browser WebGPU/WASM inference, SDK cross-origin behavior, latency and output correctness remain unverified by CI. CI also still needs an npm lockfile before it can use npm ci.
