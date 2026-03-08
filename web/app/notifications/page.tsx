"use client";

import { motion } from "framer-motion";

const notifications = [
  { title: "Elevated stress detected", detail: "Try a breathing exercise. AI will re-evaluate in 30 minutes.", level: "warning" },
  { title: "Heart rate stable", detail: "No anomalies detected in the last 4 hours.", level: "info" },
  { title: "Nearby ER available", detail: "Aurora General ER capacity: High. Travel time: 6 minutes.", level: "critical" }
];

const badge: Record<string, string> = {
  warning: "bg-amber-500/20 text-amber-200",
  info: "bg-blue-500/20 text-blue-200",
  critical: "bg-red-500/20 text-red-200"
};

export default function NotificationsPage() {
  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Notification Center</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Stay ahead of alerts</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass neon-border space-y-3 rounded-3xl border-white/10 p-8 shadow-card"
        >
          {notifications.map((n, idx) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div>
                <div className="font-semibold text-white">{n.title}</div>
                <div className="text-sm text-white/70">{n.detail}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[n.level]}`}>{n.level}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
