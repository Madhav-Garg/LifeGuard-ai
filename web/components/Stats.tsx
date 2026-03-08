"use client";

import { motion, useInView, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Health Checks", value: 1_000_000, suffix: "+" },
  { label: "Prediction Accuracy", value: 92, suffix: "%" },
  { label: "Hospitals Connected", value: 500, suffix: "+" }
];

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 15, stiffness: 100 });
  const [display, setDisplay] = useState("0");
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(Math.floor(latest).toLocaleString());
  });

  return (
    <span ref={ref} className="font-display text-4xl text-neon">
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="glass neon-border mx-auto max-w-5xl rounded-3xl border-white/10 px-6 py-10 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-card"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-sm uppercase tracking-wide text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
