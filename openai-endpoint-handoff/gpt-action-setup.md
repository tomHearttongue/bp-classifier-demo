# Step-By-Step: Create A GPT Action For The Classifier

Use this only if you want the GPT to call your classifier endpoint from inside ChatGPT.

Important boundary:

- A GPT Action lets the GPT call your external API.
- A GPT Action does not make the GPT itself an API endpoint for GitHub Pages.
- Your GitHub Pages prototype still needs to call a real HTTPS endpoint directly.

In this architecture, the GPT Action is useful for reviewer demonstration and manual testing. The production-like app path remains:

```text
GitHub Pages UI -> your HTTPS classifier endpoint -> OpenAI API
```

Expected GitHub Pages UI:

```text
https://tomhearttongue.github.io/bp-classifier-demo/
```

The GPT Action path is:

```text
Reviewer chats with GPT -> GPT Action -> your HTTPS classifier endpoint -> OpenAI API
```

## Prerequisite

You need a deployed HTTPS endpoint first.

Example:

```text
https://your-worker.example.workers.dev/classify
```

The endpoint should accept the request body from `sample-request.json` and return the response body from `sample-response.json`.

## Step 1: Open Your GPT

1. Open ChatGPT in a web browser.
2. Go to **Explore GPTs**.
3. Open **My GPTs**.
4. Select your classifier GPT.
5. Click **Edit**.
6. Go to the **Configure** view.

## Step 2: Confirm Knowledge Files

Upload these files in **Knowledge**:

```text
README.md
endpoint-contract.md
classification-schema.json
system-prompt.md
sample-request.json
sample-response.json
implementation-options.md
return-with-this.md
gpt-action-setup.md
```

Do not rely on Knowledge for behavior rules alone. Put the core behavior in the GPT instructions too.

## Step 3: Add Or Confirm GPT Instructions

Use the instructions from the previous setup guidance, especially:

```text
You are an enterprise internal-support orchestration classifier.
Use AI to interpret and assist. Use deterministic controls to authorize and act.
Do not decide eligibility, approvals, access, legal terms, spending authorization, or fulfillment.
When using an Action, call the classifier endpoint only for intent classification.
Return structured classifications grounded in the provided service catalog.
```

## Step 4: Create A New Action

1. In the GPT editor, find **Actions**.
2. Select **Create new action**.
3. If the editor asks for authentication first, choose the option that matches your endpoint.

Recommended for first test:

```text
Authentication: None
```

Recommended once the endpoint is stable:

```text
Authentication: API key
Type: Custom header
Header name: X-Demo-Token
```

Only use API-key authentication if your endpoint actually checks that header.

## Step 5: Add A Privacy Policy URL

If you share the GPT publicly or by link and it uses Actions, provide a valid privacy policy URL.

For an early private test, you can use a simple GitHub Pages or GitHub repo page that states:

```text
This demo sends support-request text and service catalog metadata to the classifier endpoint for intent classification. Do not enter confidential, personal, or production company data.
```

## Step 6: Paste The OpenAPI Schema

Replace this placeholder before pasting:

```text
https://your-worker.example.workers.dev
```

Use your endpoint base URL. If your full endpoint is:

```text
https://your-worker.example.workers.dev/classify
```

then the server URL is:

```text
https://your-worker.example.workers.dev
```

and the path is:

```text
/classify
```

Paste this schema into the Action schema editor:

```yaml
openapi: 3.1.0
info:
  title: Internal Support Intent Classifier
  version: 1.0.0
  description: Classifies employee support requests into governed internal service workflows.
servers:
  - url: https://your-worker.example.workers.dev
paths:
  /classify:
    post:
      operationId: classifySupportRequest
      summary: Classify an employee support request
      description: >
        Classifies an employee support request into one configured service.
        This action only performs intent classification. It does not decide
        eligibility, approval, authorization, routing, or fulfillment.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              additionalProperties: false
              properties:
                question:
                  type: string
                  description: Employee support request written in natural language.
                services:
                  type: array
                  description: Configured service catalog supplied by the caller.
                  items:
                    type: object
                    additionalProperties: false
                    properties:
                      id:
                        type: string
                        description: Stable service ID.
                      service:
                        type: string
                        description: Human-readable service name.
                      owner:
                        type: string
                        description: Accountable owner for this service.
                      source_required:
                        type: string
                        description: Authoritative source required for this service.
                    required:
                      - id
                      - service
                      - owner
                      - source_required
              required:
                - question
                - services
      responses:
        "200":
          description: Intent classification result
          content:
            application/json:
              schema:
                type: object
                additionalProperties: false
                properties:
                  service_id:
                    anyOf:
                      - type: string
                      - type: "null"
                    description: Selected service ID, or null if no service clearly matches.
                  confidence:
                    type: string
                    enum:
                      - low
                      - medium
                      - high
                  rationale:
                    type: string
                    description: Brief grounded explanation for the classification.
                  missing_source:
                    type: boolean
                    description: True when the request requires source coverage not present in the catalog.
                  ambiguous:
                    type: boolean
                    description: True when multiple services could reasonably match.
                  model:
                    type: string
                    description: Model used by the endpoint.
                required:
                  - service_id
                  - confidence
                  - rationale
                  - missing_source
                  - ambiguous
                  - model
        "400":
          description: Invalid request
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        "500":
          description: Server configuration or OpenAI API error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
```

## Step 7: Validate Detected Action

After pasting the schema:

1. Confirm the GPT editor detects one action.
2. The action should be named:

```text
classifySupportRequest
```

3. If validation fails, check:

```text
servers[0].url has no trailing /classify path
paths contains /classify
operationId is present
requestBody uses application/json
YAML indentation is intact
```

## Step 8: Test In Preview

In the GPT Preview panel, use:

```text
Classify this request using the action:

"How do I enter my airfare expense for an upcoming client onsite meeting?"

Use this service catalog:
[
  {
    "id": "travel",
    "service": "Travel and Expense",
    "owner": "Finance / Travel Operations",
    "source_required": "Travel and Expense Policy"
  },
  {
    "id": "badge",
    "service": "Facilities Access",
    "owner": "Facilities / Security",
    "source_required": "Facilities Access Policy"
  },
  {
    "id": "gym",
    "service": "Facilities Amenities",
    "owner": "Facilities",
    "source_required": "Facilities Amenities Guide"
  },
  {
    "id": "legal",
    "service": "Legal / Sales Operations",
    "owner": "Legal / Sales Operations",
    "source_required": "Contract Intake Procedure"
  }
]

Return the action result and then briefly explain what deterministic controls still need to decide.
```

Expected action result:

```json
{
  "service_id": "travel",
  "confidence": "high",
  "rationale": "The employee asks about airfare expense entry for client travel, which maps to Travel and Expense.",
  "missing_source": false,
  "ambiguous": false,
  "model": "gpt-5-mini"
}
```

## Step 9: Test Unknown Or Ambiguous Request

Use:

```text
Classify this request using the action:

"Can I bring a personal drone into the office?"

Use the same service catalog.
```

Good result:

```json
{
  "service_id": null,
  "confidence": "low",
  "rationale": "The request does not clearly match the configured services and likely requires a separate workplace safety or facilities policy source.",
  "missing_source": true,
  "ambiguous": false,
  "model": "gpt-5-mini"
}
```

## Step 10: Save And Bring Back Details

Bring these back to Codex:

```text
GPT name:
Action name / operationId:
Action server URL:
Action path:
Authentication mode:
Required headers:
Privacy policy URL:
Example successful action call:
Example error action call:
Can the GitHub Pages app call the same endpoint directly?
```

The final question matters most. If GitHub Pages can call the same endpoint directly, the prototype can use it. If only the GPT can call it, then the Action is useful for reviewer demonstration but not for the web app itself.

For this repo, "GitHub Pages can call it" means the endpoint accepts browser requests from:

```text
https://tomhearttongue.github.io
```
