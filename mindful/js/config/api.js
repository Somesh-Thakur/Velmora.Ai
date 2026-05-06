export const API_CONFIG = {
  providers: {
    groq: {
      endpoint: "/.netlify/functions/groq",
      model: "llama-3.3-70b-versatile"
    },
    openrouter: {
      endpoint: "/.netlify/functions/openrouter",
      model: "deepseek/deepseek-chat"
    },
    huggingface: {
      endpoint: "/.netlify/functions/huggingface",
      model: "mistralai/Mistral-7B-Instruct-v0.3"
    }
  },
  auth: {
    discordSignInUrl: "",
    discordSignUpUrl: ""
  }
};
