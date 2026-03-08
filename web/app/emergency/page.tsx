"use client";

import { motion } from "framer-motion";

export default function EmergencyPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Emergency Detection</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Real-time scanner UI</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass neon-border relative overflow-hidden rounded-3xl border-white/10 p-8 shadow-card"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,245,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.18),transparent_30%)]" />
            <div className="relative space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-sm text-white/70">
                Camera feed placeholder — integrate WebRTC to stream user camera and run fatigue/pulse detection overlays.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm uppercase tracking-wide text-white/60">Pulse waveform</div>
                <div className="mt-3 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple/40 via-neon/30 to-blue-500/30">
                  <div className="h-full w-full animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_100%]" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.6) 50%, transparent 100%)" }} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass neon-border space-y-4 rounded-3xl border-white/10 p-8 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-wide text-white/60">Alert monitor</div>
                <div className="font-display text-2xl text-white">Stable</div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-neon/15 px-3 py-1 text-xs text-neon">
                <span className="h-2 w-2 animate-ping rounded-full bg-neon" /> Live
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Pulse</span>
                <span className="text-neon font-semibold">72 bpm</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple via-blue-500 to-neon" style={{ width: "62%" }} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Fatigue detection</span>
                <span className="text-neon font-semibold">Low</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple via-blue-500 to-neon" style={{ width: "30%" }} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Emergency risk</span>
                <span className="text-neon font-semibold">Safe</span>
              </div>
            </div>
            <button className="w-full rounded-xl border border-neon/40 bg-neon/20 px-4 py-3 font-semibold text-neon shadow-glow">
              Trigger Emergency Alert
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
