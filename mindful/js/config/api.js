export const API_CONFIG = {
  providers: {
    groq: {
      endpoint: "/api/groq",
      model: "llama-3.3-70b-versatile"
    },
    openrouter: {
      endpoint: "/api/openrouter",
      model: "deepseek-chat"
    },
    huggingface: {
      endpoint: "/api/huggingface",
      model: "mistralai/Mistral-7B-Instruct-v0.3"
    }
  },
  auth: {
    discordSignInUrl: "",
    discordSignUpUrl: ""
  }
};
