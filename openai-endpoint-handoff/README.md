# OpenAI Endpoint Handoff

Use this folder when you build the OpenAI-powered classification endpoint separately.

The GitHub Pages prototype should not contain an OpenAI API key. It should call a server-side endpoint that you control. That endpoint can be a Cloudflare Worker, GitHub-backed service, Custom GPT Action, lightweight API route, or another secure proxy.

## What The Endpoint Should Do

The endpoint should:

1. Accept an employee support question.
2. Compare it against the provided service catalog.
3. Return a structured intent classification.
4. Explain confidence and rationale.
5. Refuse to make approval, eligibility, access, legal, or fulfillment decisions.

The endpoint should not:

- Create tickets
- Approve requests
- Decide eligibility
- Grant access
- Invent policy
- Return unsupported instructions as authoritative

## Files In This Folder

- `endpoint-contract.md`: request and response contract the prototype expects.
- `classification-schema.json`: JSON schema for the endpoint response.
- `system-prompt.md`: prompt/instructions for the OpenAI classifier.
- `sample-request.json`: sample request from the prototype.
- `sample-response.json`: valid response example.
- `implementation-options.md`: low-budget ways to host or build the endpoint.
- `return-with-this.md`: checklist of exact details to bring back so the prototype can be wired to the real endpoint.

## Recommended Boundary

Use AI to interpret the employee request. Use deterministic service rules to decide what happens next.

That means your endpoint should return:

- The most likely service ID
- Confidence
- Rationale
- Any ambiguity or missing-source signal

The browser prototype will still apply deterministic controls after classification.
