# AI-Governed Internal Support Orchestrator

A static proof of concept showing how internal support questions can become source-backed answers, guided service requests, deterministic decisions, and human-review workflows.

## Why This Exists

Employees often search across fragmented internal documentation, while support teams repeatedly answer common questions and manually route requests. A generic chatbot can make that worse if it invents policy or takes action without the right controls.

This prototype demonstrates a better operating model:

- AI assists with interpretation, retrieval, summarization, and handoff drafting.
- Deterministic controls handle eligibility, approval, routing, workflow state, and auditability.
- Human review is explicit, explainable, and measurable.
- No approved source means no authoritative answer.

## How Reviewers Should Use It

This project is designed for GitHub Pages in this clean repository:

```text
https://github.com/tomHearttongue/bp-classifier-demo
```

After publishing, the prototype should be shared as:

```text
https://tomhearttongue.github.io/bp-classifier-demo/
```

The page has two distinct parts:

- **Interactive Prototype:** the playable workflow demo.
- **Reviewer Context:** architecture, integration strategy, governance, evaluation, and production boundaries.

The core app is a single self-contained `index.html` file with no build step, backend, package install, or external dependency. The optional OpenAI API classifier uses a separate server-side endpoint so the API key is never exposed in GitHub Pages.

## Demo Scenarios

- Airfare expense for an upcoming client onsite meeting
- Lost employee key card replacement
- Company gym access
- Sales agreement intake
- Unknown request with no approved source

## What It Demonstrates

- Natural-language intake
- Service classification
- Optional OpenAI API intent classification through a secret-safe endpoint
- Approved-source and owner checks
- Scenario-specific request intake
- AI versus deterministic tool selection
- Human-review flag assignment
- Review or fulfillment packet generation
- Production integration points across knowledge, identity, workflow, and systems of record

## What It Does Not Include

- Authentication
- Live knowledge retrieval
- Real ticket creation
- Production integrations
- Persistent storage
- Enterprise access controls
- Production-grade AI evaluation

## Optional OpenAI API Mode

GitHub Pages cannot safely call OpenAI directly because client-side code would expose the API key.

This repo includes `worker/openai-classifier.js`, a small server-side endpoint that can be deployed to Cloudflare Workers or a similar serverless host. The endpoint calls the OpenAI Responses API and returns only an intent classification. The workflow decision remains deterministic in the browser.

See [docs/openai-api-integration.md](docs/openai-api-integration.md).

Privacy policy for GPT Actions or public demos:
[https://tomhearttongue.github.io/bp-classifier-demo/privacy.html](https://tomhearttongue.github.io/bp-classifier-demo/privacy.html)

## Publish With GitHub Pages

1. Push these files to `tomHearttongue/bp-classifier-demo`.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the main branch and `/root`.
5. Save, then copy the published Pages URL.

To enable live OpenAI classification, deploy the Worker endpoint separately and paste its URL into the demo's **Optional OpenAI API classifier** panel.

## Repository Contents

```text
index.html                         Static GitHub Pages prototype
privacy.html                       Privacy policy for GPT Actions/demo use
README.md                          Reviewer-facing project overview
docs/openai-api-integration.md     OpenAI endpoint setup notes
worker/openai-classifier.js        Optional Cloudflare Worker classifier
openai-endpoint-handoff/           Materials for GPT Action or endpoint setup
```

## Positioning

This is not a replacement for a ticketing platform. It is a rapid proof of concept for an AI-enabled internal support orchestration layer.

The point is to show how an ambiguous business problem can be translated into a governed, testable workflow with clear production boundaries.

## Design Principle

Use AI to interpret and assist; use deterministic controls to authorize and act.
