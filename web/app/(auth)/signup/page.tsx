"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 mx-auto max-w-5xl grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl text-white"
          >
            Create your LifeGuard AI account
          </motion.h1>
          <p className="text-white/70">Personalize your health profile, unlock AI predictions, and stay ahead of emergencies.</p>
          <div className="glass neon-border hidden rounded-3xl border-white/10 p-6 text-sm text-white/80 lg:block">
            <div className="text-neon font-semibold">Privacy-first</div>
            <p className="mt-2 text-white/70">We only process data to deliver predictions and never sell or share your information.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="glass neon-border relative overflow-hidden rounded-3xl border-white/10 p-8 shadow-card"
        >
          <div className="absolute inset-0 opacity-60" style={{ background: "linear-gradient(140deg, rgba(0,245,255,0.12), rgba(124,58,237,0.16))" }} />
          <form className="relative space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Full name</label>
              <input className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="Alex Rivera" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Email</label>
              <input className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="you@lifeguard.ai" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Password</label>
              <input type="password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="••••••••" />
            </div>
            <button className="relative w-full overflow-hidden rounded-xl px-4 py-3 font-semibold text-navy shadow-glow">
              <span className="absolute inset-0 gradient-accent" />
              <span className="relative">Create Account</span>
            </button>
            <button type="button" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white hover:border-neon/50 transition">
              Sign up with Google
            </button>
            <p className="text-center text-sm text-white/70">
              Already have an account? <Link href="/login" className="text-neon">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
