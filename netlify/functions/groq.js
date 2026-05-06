exports.handler = async (event, context) => {
  console.log("Groq function called:", event.httpMethod);
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    console.error("GROQ_API_KEY not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GROQ_API_KEY not configured" })
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

    console.log("Sending to Groq:", { model, messageCount: messages?.length });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: messages || [],
        system: system,
        stream: true
      })
    });

    console.log("Groq response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText || response.statusText })
      };
    }

    const text = await response.text();
    console.log("Groq response length:", text.length);
    
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
    console.error("Groq function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
