export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hfKey = context.env.HUGGINGFACE_API_KEY;
  if (!hfKey) {
    return new Response(JSON.stringify({ error: "HUGGINGFACE_API_KEY not set" }), { status: 500 });
  }

  try {
    const { model, messages, system } = await request.json();

    // Convert to HuggingFace format
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
      return new Response(
        JSON.stringify({ error: `HuggingFace error: ${response.statusText}` }),
        { status: response.status }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
