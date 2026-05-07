exports.handler = async (event, context) => {
  console.log("OpenRouter function called:", event.httpMethod);
  console.log("Request body:", event.body);
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey) {
    console.error("OPENROUTER_API_KEY not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OPENROUTER_API_KEY not configured" })
    };
  }

  try {
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
      console.log("Parsed payload:", JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error("Failed to parse body:", event.body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body", body: event.body })
      };
    }

    const { model, messages, system } = payload;

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages:", messages);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "messages must be an array" })
      };
    }

    console.log("Sending to OpenRouter:", { model, messageCount: messages.length });

    // OpenRouter uses OpenAI format: system prompt must be first message in array
    const allMessages = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;

    const requestBody = {
      model: model || "deepseek/deepseek-chat",
      messages: allMessages,
      stream: true
    };

    console.log("OpenRouter request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://velmoraai.netlify.app",
        "X-Title": "VelmoraCare AI"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText || response.statusText, status: response.status })
      };
    }

    const text = await response.text();
    console.log("OpenRouter response length:", text.length);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
      body: text
    };
  } catch (error) {
    console.error("OpenRouter function error:", error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
