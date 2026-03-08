import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MODEL = "llama-3.1-8b-instant";

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json();
    if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const prompt = `You are a medical triage assistant. Given the user's symptoms, provide a concise triage summary (2-3 sentences) and clear next steps. Avoid long explanations or disclaimers. Symptoms: ${symptoms}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a concise medical triage assistant. Keep responses brief and actionable." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 200
      })
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      console.error("Groq error", groqRes.status, text);
      return NextResponse.json({ error: text || "Groq request failed" }, { status: 502 });
    }

    const data = await groqRes.json();
    const result = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ result: result || "No content returned." });
  } catch (err: unknown) {
    console.error("Analyze symptoms error", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
