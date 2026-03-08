"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState("");
  const [symptomResult, setSymptomResult] = useState<string | null>(null);
  const [symptomLoading, setSymptomLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportAge, setReportAge] = useState("");
  const [reportAscii, setReportAscii] = useState<string | null>(null);
  const [reportSections, setReportSections] = useState<{ summary?: string; likely_causes?: string[]; red_flags?: string[]; home_care?: string[]; next_steps?: string[] } | null>(null);
  const [riskInputs, setRiskInputs] = useState({ age: "", stress: "", sleep: "", exercise: "" });
  const [riskResult, setRiskResult] = useState<string | null>(null);
  const [dietInputs, setDietInputs] = useState({ age: "", weight: "", height: "", goal: "maintain", restrictions: "", activity: "moderate" });
  const [dietResult, setDietResult] = useState<string | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Array<{ name: string; vicinity?: string }>>([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [hospitalError, setHospitalError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I am your AI health chatbot. Tell me your symptoms or health question." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [widgetValues, setWidgetValues] = useState({
    healthScore: "—",
    bmi: "—",
    sleepQuality: "—",
    stressLevel: "—"
  });

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setSymptomResult("Please enter symptoms to analyze.");
      return;
    }
    try {
      setSymptomLoading(true);
      setSymptomResult(null);
      const res = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
        cache: "no-store"
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Request failed: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      setSymptomResult(data.result || "No response received.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI service unavailable. Please try again.";
      setSymptomResult(msg);
    } finally {
      setSymptomLoading(false);
    }
  };

  const handleRiskChange = (key: keyof typeof riskInputs) => (value: string) => {
    setRiskInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleDietChange = (key: keyof typeof dietInputs) => (value: string) => {
    setDietInputs(prev => ({ ...prev, [key]: value }));
  };

  const requestLocation = () =>
    new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location not available. Enable GPS/permissions."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(new Error(err.message || "Location permission denied.")),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });

  const handlePredictRisk = () => {
    const age = Number(riskInputs.age) || 0;
    const stress = Number(riskInputs.stress) || 0;
    const sleep = Number(riskInputs.sleep) || 0;
    const exercise = Number(riskInputs.exercise) || 0;

    if (!riskInputs.age || !riskInputs.stress || !riskInputs.sleep || !riskInputs.exercise) {
      setRiskResult("Please fill all lifestyle inputs before predicting risk.");
      return;
    }

    const score = Math.max(0, Math.min(100, 70 + stress * 2 - sleep * 3 - exercise * 2 + age * 0.3));
    const label = score > 75 ? "Elevated" : score > 55 ? "Moderate" : "Low";
    setRiskResult(
      `${label} risk (${score.toFixed(0)}%) based on your inputs. ` +
      `Age: ${riskInputs.age}, Stress: ${riskInputs.stress}, Sleep: ${riskInputs.sleep}h, Exercise: ${riskInputs.exercise}h/week.`
    );

    // Derive dashboard widget values from the user's inputs so the cards are user-driven, not mocked.
    const healthScore = Math.max(0, Math.min(100, 100 - score)).toFixed(0);
    // Derive BMI from diet inputs if provided; fall back to risk inputs if missing.
    const weightRaw = dietInputs.weight || riskInputs.exercise; // allow user to reuse fields if mis-typed
    const heightRaw = dietInputs.height || riskInputs.sleep; // not ideal, but gives a fallback
    const weight = Number(weightRaw);
    const height = Number(heightRaw);
    const bmi = weight > 0 && height > 0 ? weight / Math.pow(height / 100, 2) : NaN;
    const bmiText = Number.isFinite(bmi) ? `${bmi.toFixed(1)} BMI` : "—";

    const sleepQuality = Math.max(0, Math.min(100, sleep * 12 + (10 - stress) * 2)).toFixed(0);
    const stressLabel = stress >= 7 ? "High" : stress >= 4 ? "Moderate" : "Low";

    setWidgetValues({
      healthScore: `${healthScore}`,
      bmi: bmiText,
      sleepQuality: `${sleepQuality}%`,
      stressLevel: stressLabel
    });
  };

  const handleGenerateReport = async () => {
    if (!symptoms.trim()) {
      setReportResult("Please enter symptoms before generating a report.");
      return;
    }

    try {
      setReportLoading(true);
      setReportResult(null);
      const res = await fetch("/api/health-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          name: reportName,
          age: reportAge,
          metrics: {
            healthScore: widgetValues.healthScore,
            stressLevel: widgetValues.stressLevel,
            sleepQuality: widgetValues.sleepQuality
          }
        })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Request failed: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      setReportResult(data.report || "No report returned.");
      setReportSections(data.sections || null);

      const parsedHealth = Number(widgetValues.healthScore);
      const parsedStress = Number(riskInputs.stress);
      const parsedSleep = Number(riskInputs.sleep);
      const parsedExercise = Number(riskInputs.exercise);
      const heartRisk = Number.isFinite(parsedHealth) ? Math.max(5, Math.min(95, 100 - parsedHealth)) : 18;
      const diabetesRisk = Math.max(
        8,
        Math.min(90, 10 + (Number.isFinite(parsedStress) ? parsedStress * 2 : 10) - (Number.isFinite(parsedSleep) ? parsedSleep : 6))
      );
      const obesityRisk = Math.max(
        10,
        Math.min(90, 12 + (Number.isFinite(parsedStress) ? parsedStress : 5) + (Number.isFinite(parsedExercise) ? Math.max(0, 8 - parsedExercise * 2) : 8))
      );

      const lines: string[] = [];
      const pad = (s: string, len: number) => {
        if (s.length >= len) return s.slice(0, len);
        return s + " ".repeat(len - s.length);
      };
      // Wider ASCII layout for a report-like feel
      const innerWidth = 57; // characters inside the borders
      const border = `+${"=".repeat(innerWidth)}+`;
      const divider = `+${"-".repeat(innerWidth)}+`;
      const padWide = (text: string) => {
        if (text.length >= innerWidth - 2) return text.slice(0, innerWidth - 2);
        return text + " ".repeat(innerWidth - 2 - text.length);
      };
      const center = (text: string) => {
        const trimmed = text.slice(0, innerWidth - 2);
        const total = innerWidth - 2 - trimmed.length;
        const left = Math.floor(total / 2);
        const right = total - left;
        return " ".repeat(left) + trimmed + " ".repeat(right);
      };

      lines.push(border);
      lines.push(`|${center("LifeGuard AI")}|`);
      lines.push(`|${center("Health Report")}|`);
      lines.push(divider);
      lines.push(`| ${padWide(`Name: ${reportName || "—"}`)} |`);
      lines.push(`| ${padWide(`Age: ${reportAge || "—"}`)} |`);
      const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      lines.push(`| ${padWide(`Date: ${date}`)} |`);
      lines.push(divider);
      lines.push(`| ${padWide(`Health Score: ${widgetValues.healthScore || "—"}`)} |`);
      lines.push(`| ${padWide(`Stress Level: ${widgetValues.stressLevel || "—"}`)} |`);
      lines.push(`| ${padWide(`Sleep Quality: ${widgetValues.sleepQuality || "—"}`)} |`);
      lines.push(divider);
      lines.push(`| ${padWide("Disease Risk Prediction")} |`);
      const risks = [
        `Heart Disease -> ${heartRisk.toFixed(0)}%`,
        `Diabetes -> ${diabetesRisk.toFixed(0)}%`,
        `Obesity -> ${obesityRisk.toFixed(0)}%`
      ];
      risks.forEach(r => lines.push(`| ${padWide(r)} |`));
      lines.push(divider);
      lines.push(`| ${padWide("AI Recommendations")} |`);
      const recs = data.sections?.next_steps || data.sections?.home_care || [];
      const topRecs = recs.slice(0, 3);
      if (topRecs.length === 0) {
        lines.push(`| ${padWide("- Keep a healthy routine")} |`);
      } else {
        topRecs.forEach(r => lines.push(`| ${padWide(`- ${r}`)} |`));
      }
      lines.push(border);
      const ascii = lines.join("\n");
      setReportAscii(ascii);
      await handleDownloadReport(ascii);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI service unavailable. Please try again.";
      setReportResult(msg);
      setReportAscii(null);
    } finally {
      setReportLoading(false);
    }
  };

  const handleGenerateDiet = async () => {
    if (!dietInputs.age || !dietInputs.weight || !dietInputs.height) {
      setDietResult("Please fill age, weight, and height.");
      return;
    }

    try {
      setDietLoading(true);
      setDietResult(null);
      const res = await fetch("/api/diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dietInputs)
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Request failed: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      setDietResult(data.plan || "No recommendation returned.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI service unavailable. Please try again.";
      setDietResult(msg);
    } finally {
      setDietLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user" as const, content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    try {
      setChatLoading(true);
      const res = await fetch("/api/health-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages.slice(-5), userMsg] })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Request failed: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      const reply = data.reply || "I could not generate a response.";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat service unavailable.";
      setChatMessages(prev => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFetchHospitals = async () => {
    try {
      setHospitalLoading(true);
      setHospitalError(null);
      setHospitals([]);
      const { lat, lng } = await requestLocation();
      const res = await fetch("/api/nearby-hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Request failed: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      setHospitals(data.hospitals || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to fetch nearby hospitals.";
      setHospitalError(msg);
    } finally {
      setHospitalLoading(false);
    }
  };

  const handleResetRisk = () => {
    setRiskInputs({ age: "", stress: "", sleep: "", exercise: "" });
    setRiskResult(null);
    setWidgetValues({ healthScore: "—", heartRate: "—", sleepQuality: "—", stressLevel: "—" });
  };

  const handleDownloadReport = async (asciiOverride?: string) => {
    const content = asciiOverride || reportAscii;
    if (!content) {
      setReportResult("Generate a report first, then download.");
      return;
    }

    try {
      const jsPDF = (await import("jspdf")).jsPDF;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFont("courier", "normal");
      doc.setFontSize(12);
      const lines = content.split("\n");
      doc.text(lines, 40, 60, { lineHeightFactor: 1.2 });
      doc.save("health-report.pdf");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF download failed.";
      setReportResult(msg);
    }
  };

  const widgets = useMemo(
    () => [
      { title: "Health Score", value: widgetValues.healthScore, accent: "#00f5ff" },
      { title: "BMI", value: widgetValues.bmi, accent: "#7c3aed" },
      { title: "Sleep Quality", value: widgetValues.sleepQuality, accent: "#06b6d4" },
      { title: "Stress Level", value: widgetValues.stressLevel, accent: "#f59e0b" }
    ],
    [widgetValues]
  );

  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neon">Dashboard</p>
            <h1 className="font-display text-3xl text-white md:text-4xl">Your health command center</h1>
          </div>
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-navy shadow-glow disabled:opacity-70"
          >
            <span className="absolute inset-0 gradient-accent" />
            <span className="relative">{reportLoading ? "Generating..." : "Generate AI Health Report"}</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {widgets.map((w, idx) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass neon-border rounded-2xl border-white/10 p-4"
            >
              <div className="text-sm text-white/60">{w.title}</div>
              <div className="mt-2 font-display text-2xl" style={{ color: w.accent }}>
                {w.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="glass neon-border rounded-3xl border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-neon">AI Symptom Checker</p>
                <h3 className="font-display text-2xl text-white">Enter symptoms to triage</h3>
              </div>
              <span className="rounded-full bg-neon/15 px-3 py-1 text-xs text-neon">Powered by AI</span>
            </div>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="e.g., headache, fever, dizziness"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                  placeholder="Your name (for report)"
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                />
                <input
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                  placeholder="Age"
                  value={reportAge}
                  onChange={e => setReportAge(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleAnalyzeSymptoms}
                className="relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-navy shadow-glow"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">{symptomLoading ? "Analyzing..." : "Analyze Symptoms"}</span>
              </button>
              {symptomResult && <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{symptomResult}</div>}
              {reportResult && !symptomResult && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{reportResult}</div>
              )}
              {reportAscii && (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadReport()}
                    className="rounded-xl border border-neon/60 bg-neon/10 px-4 py-2 text-sm font-semibold text-neon"
                  >
                    Download Latest PDF
                  </button>
                  <div className="flex-1 min-w-[240px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80 whitespace-pre">
                    {reportAscii}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="glass neon-border rounded-3xl border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-neon">Health Risk Prediction</p>
                <h3 className="font-display text-2xl text-white">Lifestyle inputs</h3>
              </div>
              <span className="rounded-full bg-purple/20 px-3 py-1 text-xs text-purple">Real-time</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Age"
                value={riskInputs.age}
                onChange={e => handleRiskChange("age")(e.target.value)}
              />
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Stress level 1-10"
                value={riskInputs.stress}
                onChange={e => handleRiskChange("stress")(e.target.value)}
              />
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Sleep hours"
                value={riskInputs.sleep}
                onChange={e => handleRiskChange("sleep")(e.target.value)}
              />
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Exercise (hrs/week)"
                value={riskInputs.exercise}
                onChange={e => handleRiskChange("exercise")(e.target.value)}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handlePredictRisk}
                className="relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-navy shadow-glow"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">Predict Risk</span>
              </button>
              <button
                type="button"
                onClick={handleResetRisk}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white hover:border-neon/50 transition"
              >
                Reset
              </button>
            </div>
            {riskResult && <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">{riskResult}</div>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass neon-border rounded-3xl border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-neon">AI Diet Recommendation</p>
                <h3 className="font-display text-2xl text-white">Personalized meal guidance</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Powered by AI</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Age"
                value={dietInputs.age}
                onChange={e => handleDietChange("age")(e.target.value)}
              />
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Weight (kg)"
                value={dietInputs.weight}
                onChange={e => handleDietChange("weight")(e.target.value)}
              />
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Height (cm)"
                value={dietInputs.height}
                onChange={e => handleDietChange("height")(e.target.value)}
              />
              <select
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                value={dietInputs.goal}
                onChange={e => handleDietChange("goal")(e.target.value)}
              >
                <option value="lose">Lose weight</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain muscle</option>
              </select>
              <select
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                value={dietInputs.activity}
                onChange={e => handleDietChange("activity")(e.target.value)}
              >
                <option value="light">Light activity</option>
                <option value="moderate">Moderate</option>
                <option value="intense">Intense</option>
              </select>
              <input
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
                placeholder="Restrictions (veg, allergies)"
                value={dietInputs.restrictions}
                onChange={e => handleDietChange("restrictions")(e.target.value)}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleGenerateDiet}
                disabled={dietLoading}
                className="relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-navy shadow-glow disabled:opacity-70"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">{dietLoading ? "Generating..." : "Get Diet Plan"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDietInputs({ age: "", weight: "", height: "", goal: "maintain", restrictions: "", activity: "moderate" });
                  setDietResult(null);
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white hover:border-neon/50 transition"
              >
                Reset
              </button>
            </div>
            {dietResult && <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 whitespace-pre-line">{dietResult}</div>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass neon-border rounded-3xl border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-neon">Nearby Hospitals</p>
                <h3 className="font-display text-2xl text-white">Find care around you</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Uses your location</span>
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={handleFetchHospitals}
                disabled={hospitalLoading}
                className="relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-navy shadow-glow disabled:opacity-70"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">{hospitalLoading ? "Locating..." : "Find Nearby Hospitals"}</span>
              </button>
              {hospitalError && <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-yellow-200/80">{hospitalError}</div>}
              {hospitals.length === 0 && !hospitalLoading && !hospitalError && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">No hospitals found yet. Tap “Find Nearby Hospitals”.</div>
              )}
              {hospitals.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 space-y-2">
                  {hospitals.map(h => (
                    <div key={`${h.name}-${h.vicinity}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <div className="font-semibold text-white">{h.name}</div>
                      {h.vicinity && <div className="text-xs text-white/70">{h.vicinity}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <button
        type="button"
        onClick={() => setChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-neon px-4 py-3 font-semibold text-navy shadow-glow"
      >
        {chatOpen ? "Close AI Chat" : "AI Health Chat"}
      </button>

      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed bottom-24 right-6 z-40 w-80 max-w-full glass neon-border rounded-3xl border-white/10 p-4 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neon">AI Health Chatbot</p>
              <h3 className="font-display text-lg text-white">Ask about symptoms</h3>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <div className="h-52 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 text-sm text-white/85">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                  <span className={`inline-block rounded-lg px-3 py-2 ${m.role === "user" ? "bg-neon/20 text-neon" : "bg-white/10 text-white"}`}>
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-neon/60"
                placeholder="Ask a health question..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !chatLoading) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSendChat}
                disabled={chatLoading}
                className="relative overflow-hidden rounded-xl px-3 py-2 text-sm font-semibold text-navy shadow-glow disabled:opacity-70"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">{chatLoading ? "..." : "Send"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
