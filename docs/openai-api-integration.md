# OpenAI API Integration

The GitHub Pages app can use OpenAI for intent classification, but the API key must never be placed in `index.html`.

This repo uses a two-part pattern:

- `index.html`: static GitHub Pages UI
- `worker/openai-classifier.js`: server-side classifier endpoint that stores `OPENAI_API_KEY` as a secret

Clean GitHub repository:

```text
https://github.com/tomHearttongue/bp-classifier-demo
```

Expected GitHub Pages URL:

```text
https://tomhearttongue.github.io/bp-classifier-demo/
```

The OpenAI call only classifies the employee request. It does not decide eligibility, approval, routing, or workflow action. Those controls remain deterministic in the app.

## Recommended Low-Budget Deployment

Use Cloudflare Workers or another free/low-cost serverless host.

### Cloudflare Worker Setup

1. Create a new Worker.
2. Copy `worker/openai-classifier.js` into the Worker source.
3. Set a Worker secret named `OPENAI_API_KEY`.
4. Optionally set `OPENAI_MODEL`; otherwise the Worker uses `gpt-5-mini`.
5. Deploy the Worker.
6. Copy the Worker URL.
7. Open the GitHub Pages demo at `https://tomhearttongue.github.io/bp-classifier-demo/`.
8. Expand **Optional OpenAI API classifier**.
9. Paste the Worker URL into **Classifier endpoint URL**.
10. Change **Classifier mode** to **OpenAI API endpoint**.

If the final Pages URL differs, use the final GitHub Pages URL when configuring CORS.

## Request Shape

The Pages UI sends:

```json
{
  "question": "I lost my employee key card. How do I get a replacement?",
  "services": [
    {
      "id": "badge",
      "service": "Facilities Access",
      "owner": "Facilities / Security",
      "source_required": "Facilities Access Policy"
    }
  ]
}
```

## Response Shape

The Worker returns:

```json
{
  "service_id": "badge",
  "confidence": "high",
  "rationale": "The request asks for replacement of a lost employee key card.",
  "model": "gpt-5-mini"
}
```

## Governance Boundary

OpenAI is used for:

- Natural-language intent classification
- Explaining classification rationale

OpenAI is not used for:

- Eligibility decisions
- Approval decisions
- Access authorization
- Workflow state changes
- Ticket creation
- SLA assignment

That separation is intentional. AI interprets; deterministic controls authorize and act.
