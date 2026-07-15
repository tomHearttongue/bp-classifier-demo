# Bring This Back To Codex

When your endpoint or GPT/action plan is ready, come back with the details below.

## Required

```text
Endpoint URL:

HTTP method:

Required request headers:

Does the browser need to send any non-secret token?

Exact request body shape:

Exact response body shape:

Example successful response:

Example error response:

CORS policy:

Model used:
```

Expected browser origin for CORS:

```text
https://tomhearttongue.github.io
```

## If You Build A Custom GPT

```text
GPT name:

What instructions did you use?

Does it expose an Action?

Action endpoint URL:

Action OpenAPI schema or request/response examples:

Does the GitHub Pages app call the Action directly, or is the GPT only for reviewer demonstration?
```

## If You Build A Worker Or API Route

```text
Hosting platform:

Endpoint URL:

Secret name for OpenAI API key:

Any public demo token:

Rate limit, if any:

Logging behavior:

Can it be called from the GitHub Pages URL?
```

Expected GitHub Pages URL:

```text
https://tomhearttongue.github.io/bp-classifier-demo/
```

## What I Need To Implement The Working Prototype

At minimum, I need:

1. Endpoint URL
2. Request body shape
3. Response body shape
4. CORS behavior
5. Whether the browser needs a public token

With that, I can wire the prototype to the real endpoint and make the classification path work end to end.
