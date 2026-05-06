# Velmora.Ai Deployment Notes

Velmora.Ai is a static vanilla HTML/CSS/JavaScript frontend. It can be deployed to any static host.

## API Configuration

Frontend API routes are configured in:

`js/config/api.js`

Put public frontend URLs here:

- `providers.groq.endpoint`
- `providers.openrouter.endpoint`
- `providers.huggingface.endpoint`
- `auth.discordSignInUrl`
- `auth.discordSignUpUrl`

Do not put Groq, OpenRouter, Hugging Face, Discord bot tokens, or Discord client secrets in this frontend file. GitHub Pages is public static hosting, so anyone can view frontend files. Put private values in backend or serverless environment variables, then expose these frontend-safe proxy routes:

- `POST /api/groq`
- `POST /api/openrouter`
- `POST /api/huggingface`
- Discord sign in URL
- Discord sign up URL

Recommended private backend environment variables are listed in the repo root `.env.example`.

Each AI endpoint should accept:

```json
{
  "model": "model-name",
  "system": "system prompt",
  "messages": []
}
```

Each AI endpoint should stream Server-Sent Events or newline-delimited JSON chunks compatible with OpenAI-style `choices[0].delta.content`, or return plain token chunks.

## Local Browser Storage

Current username/password accounts, sessions, chat history, and settings are stored in this browser only. Clearing browser cookies/site data removes them. They do not sync across devices or browsers until a backend account system is added.
