import { NextResponse } from "next/server";

const MODEL = "llama-3.1-8b-instant";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatBody = { messages?: ChatMessage[] };

export async function POST(request: Request) {
  try {
    const body: ChatBody = await request.json();
    const messages = body.messages || [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const systemPrompt = "You are a concise, friendly health chatbot. Provide brief, non-alarming guidance and when to see a doctor. Do not provide long disclaimers.";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.4,
        max_tokens: 320
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Chat request failed" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || "No reply." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
