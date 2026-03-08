"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Profile = {
  age: string;
  weight: string;
  height: string;
  lifestyle: string;
  diet: string;
  exercise: string;
  sleep: string;
  stress: string;
  allergies: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    age: "",
    weight: "",
    height: "",
    lifestyle: "",
    diet: "",
    exercise: "",
    sleep: "",
    stress: "5",
    allergies: ""
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lifeguard_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Profile;
        setProfile(parsed);
      } catch {
        // ignore bad data
      }
    }
  }, []);

  const handleChange = (key: keyof Profile) => (value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("lifeguard_profile", JSON.stringify(profile));
    setSavedMessage("Profile saved locally. Update anytime.");
    setTimeout(() => setSavedMessage(null), 2500);
  };

  return (
    <div className="relative min-h-screen px-6 py-16 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon">Health Profile</p>
          <h1 className="font-display text-3xl text-white md:text-4xl">Personalize your baseline</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass neon-border grid gap-4 rounded-3xl border-white/10 p-8 shadow-card md:grid-cols-2"
        >
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Age</span>
            <input
              type="number"
              value={profile.age}
              onChange={e => handleChange("age")(e.target.value)}
              placeholder="32"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Weight (kg)</span>
            <input
              type="number"
              value={profile.weight}
              onChange={e => handleChange("weight")(e.target.value)}
              placeholder="70"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Height (cm)</span>
            <input
              type="number"
              value={profile.height}
              onChange={e => handleChange("height")(e.target.value)}
              placeholder="175"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Lifestyle</span>
            <input
              type="text"
              value={profile.lifestyle}
              onChange={e => handleChange("lifestyle")(e.target.value)}
              placeholder="Active"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Diet</span>
            <input
              type="text"
              value={profile.diet}
              onChange={e => handleChange("diet")(e.target.value)}
              placeholder="Mediterranean"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Exercise (hrs/week)</span>
            <input
              type="number"
              value={profile.exercise}
              onChange={e => handleChange("exercise")(e.target.value)}
              placeholder="4"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Sleep hours</span>
            <input
              type="number"
              value={profile.sleep}
              onChange={e => handleChange("sleep")(e.target.value)}
              placeholder="7"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
            />
          </label>
          <label className="space-y-2 text-white/80">
            <span className="text-sm">Stress level (1-10)</span>
            <input
              type="range"
              min="1"
              max="10"
              value={profile.stress}
              onChange={e => handleChange("stress")(e.target.value)}
              className="w-full accent-neon"
            />
            <div className="text-xs text-white/60">Current: {profile.stress}</div>
          </label>
          <label className="md:col-span-2 space-y-2 text-white/80">
            <span className="text-sm">Allergies</span>
            <textarea
              value={profile.allergies}
              onChange={e => handleChange("allergies")(e.target.value)}
              placeholder="e.g., peanuts, penicillin"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60"
              rows={3}
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="relative overflow-hidden rounded-xl px-5 py-3 font-semibold text-navy shadow-glow"
            >
              <span className="absolute inset-0 gradient-accent" />
              <span className="relative">Save Profile</span>
            </button>
          </div>
          {savedMessage && (
            <div className="md:col-span-2 rounded-xl border border-neon/40 bg-neon/10 px-4 py-3 text-sm text-neon">
              {savedMessage}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
