# Implementation Options

The prototype only needs an HTTPS endpoint that accepts the request contract and returns the response contract.

## Option 1: Cloudflare Worker

Good for:

- Near-zero budget
- Simple deployment
- Storing `OPENAI_API_KEY` as a secret
- Public GitHub Pages demo

Use `worker/openai-classifier.js` in the main repo as a starting point.

## Option 2: Custom GPT With Action

Good for:

- Showing agent/tool design knowledge
- Keeping a conversational interface around the classifier
- Manually testing classification before wiring the site

You will still need an action endpoint if the GitHub Pages app is going to call it directly.

## Option 3: GitHub Actions

Good for:

- Batch evaluation
- Regression tests
- Governance checks

Less ideal for:

- Realtime browser classification

## Option 4: Small Serverless API Route

Possible hosts:

- Vercel
- Netlify Functions
- Cloudflare Workers
- Render
- Fly.io

Good for:

- A production-like API pattern
- Adding authentication, rate limits, and logs later

## Recommended First Build

Start with Cloudflare Workers or another simple serverless endpoint.

Keep the endpoint narrow:

1. Receive question and service catalog.
2. Call OpenAI.
3. Return classification JSON.
4. Let the browser apply deterministic workflow rules.
