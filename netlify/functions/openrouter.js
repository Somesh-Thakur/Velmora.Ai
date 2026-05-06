exports.handler = async (event, context) => {
  console.log("OpenRouter function called:", event.httpMethod);
  
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
    } catch (e) {
      console.error("Failed to parse body:", event.body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body" })
      };
    }

    const { model, messages, system } = payload;

    console.log("Sending to OpenRouter:", { model, messageCount: messages?.length });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "deepseek-chat",
        messages: messages || [],
        system: system,
        stream: true
      })
    });

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText || response.statusText })
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
    console.error("OpenRouter function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
