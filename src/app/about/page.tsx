"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
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
                25+ Years of Educational Excellence
              </h2>
              <p className="text-[#666] mb-4">
                Founded in 1999, Balayeasu School has been a beacon of quality education in our community. 
                What started as a small school with just 50 students has grown into a premier educational 
                institution serving over 1,500 students from Class 1 to 10.
              </p>
              <p className="text-[#666] mb-4">
                Our journey has been marked by continuous innovation in teaching methods, infrastructure 
                development, and a deep commitment to nurturing every child&apos;s potential.
              </p>
              <p className="text-[#666]">
                Today, we stand proud as one of the leading schools in the region, known for our 
                academic excellence, state-of-the-art facilities, and holistic approach to education.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#C4A35A] to-[#A38842] rounded-3xl p-8 text-white"
            >
              <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Key Milestones</h3>
              <div className="space-y-4">
                {[
                  { year: "1999", event: "School Founded with 50 students" },
                  { year: "2005", event: "Expanded to Class 10" },
                  { year: "2010", event: "New campus with modern facilities" },
                  { year: "2015", event: "100% pass rate achieved" },
                  { year: "2020", event: "Digital learning integration" },
                  { year: "2024", event: "1500+ students strong" },
                ].map((milestone) => (
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
            {[
              {
                title: "Our Mission",
                icon: "🎯",
                content: "To provide quality education that nurtures intellectual curiosity, builds character, and prepares students to be responsible citizens of tomorrow.",
              },
              {
                title: "Our Vision",
                icon: "👁️",
                content: "To be a center of educational excellence where every child discovers their potential and develops the skills to succeed in a rapidly changing world.",
              },
              {
                title: "Our Values",
                icon: "💎",
                content: "Integrity, Excellence, Respect, Innovation, and Community. These core values guide everything we do at Balayeasu School.",
              },
            ].map((item) => (
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
            {[
              { name: "Dr. Rajesh Kumar", role: "Principal", exp: "25+ years in education" },
              { name: "Mrs. Sunita Sharma", role: "Vice Principal", exp: "20+ years in education" },
              { name: "Mr. Anil Verma", role: "Academic Director", exp: "18+ years in education" },
            ].map((leader) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-3xl font-bold">
                  {leader.name.split(' ').map(n => n[0]).join('')}
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
