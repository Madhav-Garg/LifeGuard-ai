import { NextResponse } from "next/server";

const MODEL = "llama-3.1-8b-instant";

type DietBody = {
  age?: string;
  weight?: string;
  height?: string;
  goal?: string;
  restrictions?: string;
  activity?: string;
};

export async function POST(request: Request) {
  try {
    const body: DietBody = await request.json();
    const { age, weight, height, goal = "maintain", restrictions = "", activity = "moderate" } = body;

    if (!age || !weight || !height) {
      return NextResponse.json({ error: "Age, weight, and height are required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const prompt = `You are a concise dietitian. User details -> age: ${age}, weight_kg: ${weight}, height_cm: ${height}, goal: ${goal}, activity: ${activity}, restrictions: ${restrictions || "none"}.
  Return exactly 6 bullets:
  1) Daily calories estimate (one number, kcal)
  2) Macros in grams (protein, carbs, fats)
  3) Breakfast with portions
  4) Lunch with portions
  5) Dinner with portions
  6) Snacks + hydration (3 snack ideas, water target)
  Keep under 90 words. Avoid foods that violate restrictions.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You produce brief, actionable diet plans." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 320
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Diet request failed" }, { status: 502 });
    }

    const data = await res.json();
    const plan = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ plan: plan || "No plan returned." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
