export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const groqKey = context.env.GROQ_API_KEY;
  if (!groqKey) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY not set" }), { status: 500 });
  }

  try {
    const { model, messages, system } = await request.json();

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
      return new Response(
        JSON.stringify({ error: `Groq error: ${response.statusText}` }),
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
