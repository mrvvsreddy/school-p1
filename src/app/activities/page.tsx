"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const activities = [
    {
        category: "Arts & Culture",
        items: [
            { name: "Music & Dance", desc: "Classical and western music, Bharatanatyam, Hip-hop, folk dances", icon: "🎵" },
            { name: "Art & Craft", desc: "Painting, sketching, clay modeling, origami", icon: "🎨" },
            { name: "Drama & Theatre", desc: "Stage performances, acting workshops, script writing", icon: "🎭" },
        ],
    },
    {
        category: "Sports & Fitness",
        items: [
            { name: "Outdoor Sports", desc: "Cricket, football, basketball, athletics", icon: "⚽" },
            { name: "Indoor Games", desc: "Badminton, table tennis, chess, carrom", icon: "🏸" },
            { name: "Yoga & Fitness", desc: "Daily yoga, meditation, fitness activities", icon: "🧘" },
        ],
    },
    {
        category: "Academic Clubs",
        items: [
            { name: "Science Club", desc: "Experiments, robotics, science exhibitions", icon: "🔬" },
            { name: "Math Club", desc: "Problem solving, competitions, puzzles", icon: "🧮" },
            { name: "Coding Club", desc: "Programming, app development, tech projects", icon: "💻" },
        ],
    },
    {
        category: "Life Skills",
        items: [
            { name: "Public Speaking", desc: "Debates, elocution, Model UN", icon: "🎤" },
            { name: "Leadership", desc: "Student council, community service", icon: "👥" },
            { name: "Environmental", desc: "Eco club, tree plantation, recycling", icon: "🌱" },
        ],
    },
];

const events = [
    { name: "Annual Day", month: "December", desc: "Grand celebration with performances and awards" },
    { name: "Sports Day", month: "January", desc: "Athletic events and inter-house competitions" },
    { name: "Science Fair", month: "February", desc: "Student projects and innovation showcase" },
    { name: "Cultural Fest", month: "March", desc: "Art, music, and dance performances" },
];

export default function ActivitiesPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#f4511e] via-[#e64a19] to-[#d84315] relative overflow-hidden">
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
                        Extracurricular Activities
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Discover your passion beyond the classroom.
                    </motion.p>
                </div>
            </section>

            {/* Activities by Category */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    {activities.map((category, catIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-16 last:mb-0"
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                                {category.category}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {category.items.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#FAF8F5] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <span className="text-4xl mb-4 block">{item.icon}</span>
                                        <h3 className="text-lg font-semibold text-[#333] mb-2">{item.name}</h3>
                                        <p className="text-[#666] text-sm">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Annual Events */}
            <section className="py-20 bg-gradient-to-r from-[#C4A35A] to-[#A38842]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Annual Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <motion.div
                                key={event.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
                            >
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{event.month}</span>
                                <h3 className="text-xl font-semibold mt-4 mb-2">{event.name}</h3>
                                <p className="text-white/80 text-sm">{event.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
