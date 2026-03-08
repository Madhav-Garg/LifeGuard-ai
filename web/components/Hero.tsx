"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeartScene from "@/components/HeartScene";

const headline = "AI That Protects Your Health Before Emergencies Happen";

export default function Hero() {
  return (
    <section className="px-6 pt-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon" />
            LifeGuard AI • Real-time protection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-4xl leading-tight text-white drop-shadow-[0_0_35px_rgba(0,245,255,0.25)] md:text-5xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-xl text-lg text-white/70"
          >
            Predict risks, analyze symptoms, and detect emergencies with a responsive AI companion designed for modern health guardians.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/login"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-semibold text-navy shadow-glow"
            >
              <span className="absolute inset-0 gradient-accent opacity-90" />
              <span className="relative">Start Your AI Health Analysis</span>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:border-neon/40 hover:text-neon transition"
            >
              See capabilities
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-md"
          >
            {[
              { label: "Health checks", value: "1M+" },
              { label: "Prediction accuracy", value: "92%" },
              { label: "Hospitals connected", value: "500+" }
            ].map((item) => (
              <div key={item.label} className="glass neon-border rounded-2xl px-3 py-4 text-center">
                <div className="font-display text-xl text-neon">{item.value}</div>
                <div className="text-xs uppercase tracking-wide text-white/60">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-neon/20 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full bg-purple/30 blur-3xl" />
          <div className="glass neon-border relative overflow-hidden rounded-3xl border-white/10 p-3">
            <HeartScene />
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <div>
                <div className="text-xs uppercase text-white/50">Live vitals</div>
                <div className="font-semibold text-white">Pulse sync • Stable</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-ping rounded-full bg-neon" />
                <span className="h-2 w-2 rounded-full bg-neon" />
                <span className="h-2 w-2 rounded-full bg-purple" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
