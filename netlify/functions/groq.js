exports.handler = async (event, context) => {
  console.log("Groq function called");
  
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
    const { model, messages, system } = JSON.parse(event.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages,
        system,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Groq error: ${response.statusText}` })
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
    console.error("Groq function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
