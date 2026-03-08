"use client";

import { motion } from "framer-motion";

const hospitals = [
  { name: "Aurora General", distance: "1.2 km", rating: 4.8 },
  { name: "Nova Heart Center", distance: "2.4 km", rating: 4.7 },
  { name: "Skyline Medical", distance: "3.1 km", rating: 4.6 }
];

export default function HospitalsPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Hospital Finder</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Find care nearby</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass neon-border relative overflow-hidden rounded-3xl border-white/10 p-4 shadow-card"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,245,255,0.08),rgba(124,58,237,0.06))]" />
            <div className="relative flex h-[360px] items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-white/70">
              Google Maps placeholder — load Maps JS API here with animated markers.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass neon-border space-y-3 rounded-3xl border-white/10 p-6 shadow-card"
          >
            <div className="text-sm uppercase tracking-wide text-white/60">Nearest hospitals</div>
            {hospitals.map((h, idx) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{h.name}</div>
                    <div className="text-xs uppercase tracking-wide text-white/50">{h.distance}</div>
                  </div>
                  <div className="rounded-full bg-neon/15 px-3 py-1 text-xs text-neon">{h.rating} ★</div>
                </div>
              </motion.div>
            ))}
            <button className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white hover:border-neon/50 transition">Show ambulance contacts</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
