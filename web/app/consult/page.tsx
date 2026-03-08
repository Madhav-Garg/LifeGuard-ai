"use client";

import { motion } from "framer-motion";

const doctors = [
  { name: "Dr. Riley Stone", specialty: "Cardiology", slots: "Today 3:00 PM" },
  { name: "Dr. Mina Kaur", specialty: "Internal Medicine", slots: "Today 5:30 PM" },
  { name: "Dr. Elias Park", specialty: "Neurology", slots: "Tomorrow 10:00 AM" }
];

export default function ConsultPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Doctor Consultation</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Book and start virtual visits</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass neon-border rounded-3xl border-white/10 p-8 shadow-card"
          >
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/70">
              Video consultation UI placeholder — integrate WebRTC/SDK to start calls, chat, and share reports.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-navy shadow-glow">
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">Start instant call</span>
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white hover:border-neon/50 transition">Share AI report</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass neon-border space-y-3 rounded-3xl border-white/10 p-6 shadow-card"
          >
            <div className="text-sm uppercase tracking-wide text-white/60">Suggested doctors</div>
            {doctors.map((doc, idx) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{doc.name}</div>
                    <div className="text-xs uppercase tracking-wide text-white/50">{doc.specialty}</div>
                  </div>
                  <div className="rounded-full bg-neon/15 px-3 py-1 text-xs text-neon">{doc.slots}</div>
                </div>
                <button className="mt-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:border-neon/50 transition">Book</button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
