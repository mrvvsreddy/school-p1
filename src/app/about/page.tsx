"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AboutData } from "@/data/types";

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/pages/about`)
      .then((res) => res.json())
      .then((data) => {
        // Handle both data structures:
        // 1. data.about (from editor which saves as { about: {...} })
        // 2. Direct data (legacy structure)
        const aboutData = data.about || data;
        setAbout(aboutData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  if (!about) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-gray-500">Failed to load content</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl"
          >
            Learn about our history, mission, and the values that drive us.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#C4A35A] font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#333] mt-2 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                {about.storyTitle}
              </h2>
              <p className="text-[#666] mb-4">{about.storyIntro1}</p>
              <p className="text-[#666] mb-4">{about.storyIntro2}</p>
              <p className="text-[#666]">{about.storyIntro3}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#C4A35A] to-[#A38842] rounded-3xl p-8 text-white"
            >
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Key Milestones</h3>
              <div className="space-y-4">
                {about.milestones.map((milestone) => (
                  <div key={milestone.year} className="flex items-start gap-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{milestone.year}</span>
                    <span className="text-white/90">{milestone.event}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Foundation
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {about.foundation.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  {item.title}
                </h3>
                <p className="text-[#666]">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Leadership
            </h2>
            <p className="text-[#666] mt-4 max-w-2xl mx-auto">
              Dedicated educators committed to shaping the future of our students.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {about.leadership.map((leader) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative">
                  {leader.image ? (
                    <Image src={leader.image} alt={leader.name} fill className="object-cover" />
                  ) : (
                    leader.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#333]">{leader.name}</h3>
                <p className="text-[#C4A35A] font-medium">{leader.role}</p>
                <p className="text-[#666] text-sm mt-1">{leader.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
