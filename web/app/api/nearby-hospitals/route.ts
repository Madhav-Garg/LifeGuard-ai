import { NextResponse } from "next/server";

type RequestBody = {
  lat?: number;
  lng?: number;
};

type OverpassElement = {
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
};

type Hospital = { name: string; vicinity?: string };

const FALLBACK_HOSPITALS: Hospital[] = [
  { name: "Fortis Hospital", vicinity: "Phase 8, Mohali" },
  { name: "Max Superspeciality Hospital", vicinity: "Phase 6, Mohali" },
  { name: "Motherhood Hospital", vicinity: "SAS Nagar" },
  { name: "Livasa Hospital", vicinity: "Sector 71, Mohali" },
  { name: "Heallthmaxx Superspeciality Hospital", vicinity: "Kharar" },
  { name: "Park Grecian Superspeciality Hospital", vicinity: "Phase 9, Mohali" },
  { name: "Ivy Hospital", vicinity: "Sector 71, Mohali" }
];

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.nextgis.com/api/interpreter"
];

async function fetchHospitals(lat: number, lng: number): Promise<Hospital[]> {
  const radius = 5000;
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center 10;
  `;

  const callOverpass = async (endpoint: string) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "lifeguard-ai/1.0 (contact@example.com)"
        },
        signal: controller.signal
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`Overpass ${endpoint} failed: ${res.status} ${text.slice(0, 200)}`);
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Overpass ${endpoint} returned non-JSON: ${text.slice(0, 200)}`);
      }
    } finally {
      clearTimeout(timer);
    }
  };

  let lastErr: string | null = null;
  for (const ep of ENDPOINTS) {
    try {
      const data = await callOverpass(ep);
      const elements = (data.elements || []) as OverpassElement[];
      return elements
        .map(el => {
          const name = el.tags?.name || "Unknown";
          const street = el.tags?.["addr:street"];
          const house = el.tags?.["addr:housenumber"];
          const city = el.tags?.["addr:city"];
          const vicinity = street || city ? `${street || ""}${house ? " " + house : ""}${city ? ", " + city : ""}`.trim() : undefined;
          return { name, vicinity } as Hospital;
        })
        .slice(0, 8);
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }
  throw new Error(lastErr || "Overpass lookup failed");
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { lat, lng } = body;

    if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
    }

    const hospitals = await fetchHospitals(lat, lng);
    if (hospitals.length === 0) {
      return NextResponse.json({ hospitals: FALLBACK_HOSPITALS, fallback: true });
    }
    return NextResponse.json({ hospitals });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
