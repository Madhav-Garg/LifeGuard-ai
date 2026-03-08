"use client";

import { motion } from "framer-motion";

const metrics = [
  { title: "Total users", value: "128,402" },
  { title: "Health checks", value: "1,204,991" },
  { title: "Active alerts", value: "312" },
  { title: "AI predictions today", value: "18,240" }
];

export default function AdminPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Admin Dashboard</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Platform intelligence</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="glass neon-border rounded-2xl border-white/10 p-4"
            >
              <div className="text-sm text-white/60">{m.title}</div>
              <div className="mt-2 font-display text-2xl text-neon">{m.value}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass neon-border grid gap-6 rounded-3xl border-white/10 p-8 shadow-card lg:grid-cols-2"
        >
          <div>
            <div className="text-sm uppercase tracking-wide text-white/60">Platform activity</div>
            <div className="mt-3 h-64 rounded-2xl border border-white/10 bg-black/40 text-center text-white/60">
              Chart placeholder — plug in charting lib for trends.
            </div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/60">AI prediction logs</div>
            <div className="mt-3 space-y-3">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  Entry {idx}: risk prediction log placeholder.
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
