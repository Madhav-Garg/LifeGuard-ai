"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Particles() {
  const dots = useMemo(() => Array.from({ length: 50 }, (_, i) => i), []);

  // Use deterministic pseudo-random positions so server and client render identically and avoid hydration warnings.
  const positions = useMemo(
    () =>
      dots.map((dot) => {
        const prng = (seed: number) => {
          const x = Math.sin(seed * 9999) * 10000;
          return x - Math.floor(x);
        };
        return {
          top: `${prng(dot * 2) * 100}%`,
          left: `${prng(dot * 2 + 1) * 100}%`
        };
      }),
    [dots]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.span
          key={dot}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan/60 shadow-glow"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.6, 1.4, 0.6],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 6 + dot * 0.05,
            delay: dot * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={positions[dot]}
        />
      ))}
    </div>
  );
}
