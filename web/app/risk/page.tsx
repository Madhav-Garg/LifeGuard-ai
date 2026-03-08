"use client";

import { motion } from "framer-motion";

const risks = [
  { name: "Heart Disease Risk", value: 0.18 },
  { name: "Diabetes Risk", value: 0.12 },
  { name: "Stress Level", value: 0.36 }
];

export default function RiskPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Health Risk Prediction</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Lifestyle-driven risk estimates</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass neon-border rounded-3xl border-white/10 p-8 shadow-card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {["Age", "BMI", "Sleep hours", "Exercise hrs/week", "Diet quality", "Stress level"].map((label) => (
                <label key={label} className="space-y-2 text-white/80">
                  <span className="text-sm">{label}</span>
                  <input className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="Enter" />
                </label>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button className="relative overflow-hidden rounded-xl px-5 py-3 font-semibold text-navy shadow-glow">
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">Predict</span>
              </button>
              <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-white hover:border-neon/50 transition">Reset</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass neon-border space-y-4 rounded-3xl border-white/10 p-8 shadow-card"
          >
            <div className="text-sm uppercase tracking-wide text-white/60">Results</div>
            {risks.map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{r.name}</div>
                  <div className="font-display text-xl text-neon">{Math.round(r.value * 100)}%</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-purple via-blue-500 to-neon" style={{ width: `${r.value * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
