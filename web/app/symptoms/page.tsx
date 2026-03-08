"use client";

import { motion } from "framer-motion";

const mockResults = [
  { condition: "Flu", probability: 0.65 },
  { condition: "Viral Infection", probability: 0.2 },
  { condition: "COVID Risk", probability: 0.15 }
];

export default function SymptomPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">AI Symptom Checker</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Describe symptoms, get probabilities</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass neon-border grid gap-6 rounded-3xl border-white/10 p-8 shadow-card lg:grid-cols-[1.2fr,1fr]"
        >
          <div className="space-y-4">
            <textarea className="h-40 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="e.g., headache, sore throat, fever, fatigue" />
            <div className="flex gap-3">
              <button className="relative overflow-hidden rounded-xl px-5 py-3 font-semibold text-navy shadow-glow">
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">Analyze with AI</span>
              </button>
              <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-white hover:border-neon/50 transition">Clear</button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm uppercase tracking-wide text-white/60">Predictions</div>
            {mockResults.map((item, idx) => (
              <motion.div
                key={item.condition}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{item.condition}</div>
                    <div className="text-xs uppercase tracking-wide text-white/50">Differential</div>
                  </div>
                  <div className="font-display text-xl text-neon">{Math.round(item.probability * 100)}%</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-purple via-blue-500 to-neon" style={{ width: `${item.probability * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
