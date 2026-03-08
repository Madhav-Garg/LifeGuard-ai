"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="glass neon-border relative overflow-hidden rounded-3xl border-white/10 px-8 py-12 shadow-card md:px-12">
        <div className="absolute inset-0 opacity-70" style={{ background: "linear-gradient(120deg, rgba(0,245,255,0.16), rgba(124,58,237,0.18))" }} />
        <div className="relative grid items-center gap-6 md:grid-cols-[2fr,1fr]">
          <div>
            <h3 className="font-display text-3xl text-white">Start Your AI Health Analysis</h3>
            <p className="mt-2 text-white/70">Sign up to unlock proactive risk prediction, emergency detection, and live hospital routing.</p>
          </div>
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
              <Link
                href="/login"
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-semibold text-navy shadow-glow"
              >
                <span className="absolute inset-0 gradient-accent" />
                <span className="relative">Sign Up / Log In</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
