exports.handler = async (event, context) => {
  console.log("HuggingFace function called");
  
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
    const { model, messages, system } = JSON.parse(event.body);

    let formattedMessages = messages;
    if (system) {
      formattedMessages = [{ role: "system", content: system }, ...messages];
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace API error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `HuggingFace error: ${response.statusText}` })
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
    console.error("HuggingFace function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
