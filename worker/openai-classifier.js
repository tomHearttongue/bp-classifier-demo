const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type"
};

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return json({
        ok: true,
        service: "bp-classifier-demo",
        message: "Classifier endpoint is running. Send POST /classify with application/json.",
        expected_body: {
          question: "I lost my employee key card. How do I get a replacement?",
          services: [
            {
              id: "badge",
              service: "Facilities Access",
              owner: "Facilities / Security",
              source_required: "Facilities Access Policy"
            }
          ]
        }
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ error: "OPENAI_API_KEY is not configured" }, 500);
    }

    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload.question !== "string" || !Array.isArray(payload.services)) {
      return json({ error: "Expected { question, services }" }, 400);
    }

    const services = payload.services.map(service => ({
      id: service.id,
      service: service.service,
      owner: service.owner,
      source_required: service.source_required
    }));

    const model = env.OPENAI_MODEL || "gpt-5.6-luna";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: [
                  "Classify an employee support request into one configured service.",
                  "Return only JSON with service_id, confidence, rationale, missing_source, and ambiguous.",
                  "If no service clearly matches, use service_id null.",
                  "Set missing_source true when the request requires a source not present in the catalog.",
                  "Set ambiguous true when multiple services could reasonably own the request.",
                  "Do not decide eligibility, approvals, or workflow actions."
                ].join(" ")
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  question: payload.question,
                  services
                })
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "support_intent_classification",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                service_id: {
                  anyOf: [
                    { type: "string", enum: services.map(service => service.id) },
                    { type: "null" }
                  ]
                },
                confidence: {
                  type: "string",
                  enum: ["low", "medium", "high"]
                },
                rationale: {
                  type: "string",
                  maxLength: 280
                },
                missing_source: {
                  type: "boolean"
                },
                ambiguous: {
                  type: "boolean"
                }
              },
              required: ["service_id", "confidence", "rationale", "missing_source", "ambiguous"]
            }
          }
        }
      })
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return json({ error: "OpenAI request failed", detail: data }, response.status);
    }

    const text = data.output_text || data.output?.flatMap(item => item.content || [])
      .find(item => item.type === "output_text")?.text;

    if (!text) {
      return json({ error: "OpenAI response did not include output_text", detail: data }, 502);
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (error) {
      return json({ error: "OpenAI response was not valid JSON", raw: text }, 502);
    }
    return json({ ...result, model });
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json; charset=utf-8"
    }
  });
}
