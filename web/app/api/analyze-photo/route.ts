import { NextResponse } from "next/server";

type Place = { name: string; vicinity?: string };

type RequestBody = {
  imageBase64?: string;
  lat?: number;
  lng?: number;
};

const CONDITIONS = [
  "Skin rash",
  "Allergic reaction",
  "Wound check",
  "Infection risk",
  "Irritation",
  "Normal variant"
];

function pickDiagnosis(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const idx = hash % CONDITIONS.length;
  return CONDITIONS[idx];
}

async function fetchPlaces(type: "hospital" | "doctor", lat: number, lng: number): Promise<Place[]> {
  const radius = 5000; // meters
  const filters =
    type === "hospital"
      ? `
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
      `
      : `
        node["healthcare"="doctor"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        way["healthcare"="doctor"](around:${radius},${lat},${lng});
        relation["healthcare"="doctor"](around:${radius},${lat},${lng});
      `;

  const query = `
    [out:json][timeout:25];
    (
      ${filters}
    );
    out center 10;
  `;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.nextgis.com/api/interpreter"
  ];

  const callOverpass = async (endpoint: string) => {
    const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "lifeguard-ai/1.0 (contact@example.com)"
      }
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Overpass ${endpoint} failed: ${res.status} ${text.slice(0, 200)}`);
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Overpass ${endpoint} returned non-JSON: ${text.slice(0, 200)}`);
    }
  };

  let data;
  let lastError: string | null = null;
  for (const ep of endpoints) {
    try {
      data = await callOverpass(ep);
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  if (!data) {
    throw new Error(lastError || "Overpass lookup failed.");
  }

  const elements = (data.elements || []) as Array<{ tags?: Record<string, string> } & { lat?: number; lon?: number }>;

  return elements
    .map(el => {
      const name = el.tags?.name || "Unknown";
      const street = el.tags?.["addr:street"];
      const house = el.tags?.["addr:housenumber"];
      const city = el.tags?.["addr:city"];
      const vicinity = street || city ? `${street || ""}${house ? " " + house : ""}${city ? ", " + city : ""}`.trim() : undefined;
      return { name, vicinity } as Place;
    })
    .slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { imageBase64, lat, lng } = body;

    if (!imageBase64 || lat == null || lng == null) {
      return NextResponse.json({ error: "Image and location are required." }, { status: 400 });
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
    }

    const diagnosis = pickDiagnosis(imageBase64.slice(0, 120));

    const [hospitals, doctors] = await Promise.all([
      fetchPlaces("hospital", lat, lng),
      fetchPlaces("doctor", lat, lng)
    ]);

    return NextResponse.json({ diagnosis, hospitals, doctors, debug: lastError ? { fallbackFrom: lastError } : undefined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
