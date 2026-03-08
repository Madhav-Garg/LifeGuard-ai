"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Enter health data", desc: "Age, vitals, lifestyle, habits, and symptoms." },
  { title: "AI analyzes symptoms", desc: "LLM + clinical patterns craft differential insights." },
  { title: "System predicts risk", desc: "Model-driven risk scoring for critical conditions." },
  { title: "Emergency detection & hospitals", desc: "Triggers alerts and routes to the nearest care." }
];

export default function HowItWorks() {
  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-neon">How it works</p>
          <h2 className="font-display text-3xl text-white md:text-4xl">From inputs to intelligent actions</h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card">
          <div className="absolute left-12 right-12 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent md:block" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/15 text-neon shadow-glow">{idx + 1}</div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-white/70">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
