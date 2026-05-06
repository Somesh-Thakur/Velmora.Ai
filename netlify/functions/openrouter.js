export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const openrouterKey = context.env.OPENROUTER_API_KEY;
  if (!openrouterKey) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY not set" }), { status: 500 });
  }

  try {
    const { model, messages, system } = await request.json();

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
      return new Response(
        JSON.stringify({ error: `OpenRouter error: ${response.statusText}` }),
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
