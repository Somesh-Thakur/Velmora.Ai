exports.handler = async (event, context) => {
  console.log("HuggingFace function called:", event.httpMethod);
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const hfKey = process.env.HUGGINGFACE_API_KEY;
  if (!hfKey) {
    console.error("HUGGINGFACE_API_KEY not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "HUGGINGFACE_API_KEY not configured" })
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

    let formattedMessages = messages || [];
    if (system) {
      formattedMessages = [{ role: "system", content: system }, ...formattedMessages];
    }

    console.log("Sending to HuggingFace:", { model, messageCount: formattedMessages.length });

    const response = await fetch(`https://api-inference.huggingface.co/models/${model || "mistralai/Mistral-7B-Instruct-v0.3"}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: formattedMessages,
        stream: true
      })
    });

    console.log("HuggingFace response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText || response.statusText })
      };
    }

    const text = await response.text();
    console.log("HuggingFace response length:", text.length);
    
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
    console.error("HuggingFace function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
