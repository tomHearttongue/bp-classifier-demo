# Endpoint Contract

The prototype will call your endpoint with an HTTP `POST`.

## Endpoint URL

You will provide this later:

```text
https://your-endpoint.example.com/classify
```

The GitHub Pages app that will call it is expected to live at:

```text
https://tomhearttongue.github.io/bp-classifier-demo/
```

## Required Request Headers

```http
content-type: application/json
```

If your endpoint requires a public demo token or other non-secret client credential, document it in `return-with-this.md`.

Do not require the browser to send an OpenAI API key.

## Request Body

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

## Response Body

Return JSON matching `classification-schema.json`.

```json
{
  "service_id": "badge",
  "confidence": "high",
  "rationale": "The request is about replacing a lost employee key card, which maps to Facilities Access.",
  "missing_source": false,
  "ambiguous": false,
  "model": "gpt-5.6-luna"
}
```

## Allowed Service IDs

Return one of the service IDs from the request, or `null` if no configured service clearly matches.

Current prototype service IDs:

- `travel`
- `badge`
- `gym`
- `legal`

## Error Response

If the endpoint fails, return a conventional JSON error:

```json
{
  "error": "Human-readable error message"
}
```

The prototype will fall back to deterministic keyword matching when the endpoint is unavailable.

## Health Check

If the endpoint is opened in a browser with `GET`, it may return a health response instead of classifying:

```json
{
  "ok": true,
  "service": "bp-classifier-demo",
  "message": "Classifier endpoint is running. Send POST /classify with application/json."
}
```

## CORS

If the endpoint is called from GitHub Pages, it must allow the Pages origin.

Expected Pages origin:

```text
https://tomhearttongue.github.io
```

For a public demo, permissive CORS is acceptable:

```http
access-control-allow-origin: *
access-control-allow-methods: POST, OPTIONS
access-control-allow-headers: content-type
```

For a more controlled demo, restrict `access-control-allow-origin` to the GitHub Pages URL.
