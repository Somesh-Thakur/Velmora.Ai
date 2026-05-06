exports.handler = async (event, context) => {
  console.log("OpenRouter function called");
  
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
    const { model, messages, system } = JSON.parse(event.body);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "deepseek-chat",
        messages,
        system,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `OpenRouter error: ${response.statusText}` })
      };
    }

    const buffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
      body: Buffer.from(buffer).toString()
    };
  } catch (error) {
    console.error("OpenRouter function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
