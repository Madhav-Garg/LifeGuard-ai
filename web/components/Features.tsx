"use client";

import { motion } from "framer-motion";
import { SparklesIcon, ShieldCheckIcon, SignalIcon, MapPinIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const features = [
  { title: "AI Symptom Checker", icon: SparklesIcon, desc: "Instant insights with OpenAI-powered triage and smart explanations." },
  { title: "Health Risk Prediction", icon: ShieldCheckIcon, desc: "Predictive modeling for heart, diabetes, and stress risks." },
  { title: "Emergency Detection", icon: SignalIcon, desc: "Live vital scans with alerting when anomalies spike." },
  { title: "Hospital Finder", icon: MapPinIcon, desc: "Nearest care with distance, ratings, and ambulance contacts." },
  { title: "Smart Health Dashboard", icon: ChartBarIcon, desc: "Animated health score, trends, and personalized goals." }
];

export default function Features() {
  return (
    <section id="features" className="px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neon">Capabilities</p>
            <h2 className="font-display text-3xl text-white md:text-4xl">Engineered for proactive care</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card"
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))" }} />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neon shadow-glow">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="relative mt-4 font-display text-xl text-white">{feature.title}</h3>
              <p className="relative mt-2 text-sm text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
