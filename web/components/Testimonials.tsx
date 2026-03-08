"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Lena Ortiz",
    role: "Emergency Physician",
    quote: "LifeGuard AI flags subtle risk patterns faster than our manual triage—it's a real safety net.",
    score: "+18% faster response"
  },
  {
    name: "Noah Patel",
    role: "Runner & Designer",
    quote: "The dashboard visuals are gorgeous and actionable. I track stress and sleep every day.",
    score: "Health score +12"
  },
  {
    name: "Ava Chen",
    role: "Ops Lead, City Clinics",
    quote: "We connect to 500+ hospitals—routing patients with live capacity data has never been smoother.",
    score: "500+ facilities"
  }
];

export default function Testimonials() {
  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Trust</p>
          <h2 className="font-display text-3xl text-white md:text-4xl">Loved by clinicians and users</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="glass neon-border relative flex h-full flex-col rounded-3xl border-white/10 p-6 shadow-card"
            >
              <div className="text-sm uppercase tracking-wide text-neon">{item.score}</div>
              <p className="mt-4 text-lg text-white/85">“{item.quote}”</p>
              <div className="mt-auto pt-6 text-sm text-white/70">
                <div className="font-semibold text-white">{item.name}</div>
                <div>{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
