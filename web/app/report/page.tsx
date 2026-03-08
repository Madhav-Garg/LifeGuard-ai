"use client";

import { motion } from "framer-motion";

const items = [
  { title: "Risk summary", desc: "Heart 18%, Diabetes 12%, Stress 36%" },
  { title: "Symptoms", desc: "Headache, sore throat, fatigue" },
  { title: "AI suggestions", desc: "Hydration, rest, monitor temperature" },
  { title: "Weekly trends", desc: "Stress improving, sleep steady" }
];

export default function ReportPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neon">AI Health Report</p>
            <h1 className="font-display text-3xl text-white md:text-4xl">Downloadable personalized report</h1>
          </div>
          <button className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-navy shadow-glow">
            <span className="absolute inset-0 gradient-accent" />
            <span className="relative">Export PDF</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass neon-border space-y-4 rounded-3xl border-white/10 p-8 shadow-card"
        >
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="font-semibold text-white">{item.title}</div>
              <div className="text-sm text-white/70">{item.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
