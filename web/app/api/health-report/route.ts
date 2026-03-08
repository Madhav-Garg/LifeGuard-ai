import { NextResponse } from "next/server";

const MODEL = "llama-3.1-8b-instant";

type ReportBody = {
  symptoms?: string;
  name?: string;
  age?: string;
  metrics?: {
    healthScore?: string;
    stressLevel?: string;
    sleepQuality?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body: ReportBody = await request.json();
    const { symptoms, name, age, metrics } = body;

    if (!symptoms || !symptoms.trim()) {
      return NextResponse.json({ error: "Symptoms are required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const prompt = `You are a concise medical triage assistant. Given the details, output strict JSON with keys: summary (string), likely_causes (array of 3 strings), red_flags (array of 3 strings), home_care (array of 3 strings), next_steps (array of 3 strings).
  Patient name: ${name || "Unknown"}
  Age: ${age || "Unknown"}
  Symptoms: ${symptoms}
  Metrics: health_score=${metrics?.healthScore || "—"}, stress_level=${metrics?.stressLevel || "—"}, sleep_quality=${metrics?.sleepQuality || "—"}.
  Keep content brief and actionable.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You produce brief, actionable health reports in JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Report request failed" }, { status: 502 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    let parsed: any = null;
    try {
      parsed = content ? JSON.parse(content) : null;
    } catch {
      parsed = null;
    }

    if (!parsed) {
      return NextResponse.json({ error: "Report parse failed" }, { status: 502 });
    }

    return NextResponse.json({
      report: parsed.summary || "No report returned.",
      sections: {
        summary: parsed.summary || "",
        likely_causes: parsed.likely_causes || [],
        red_flags: parsed.red_flags || [],
        home_care: parsed.home_care || [],
        next_steps: parsed.next_steps || []
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
