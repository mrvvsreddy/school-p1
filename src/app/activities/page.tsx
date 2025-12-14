"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const activities = [
    {
        title: "Arts & Culture",
        description: "Nurture creativity and artistic expression through our comprehensive arts program. Students explore various art forms including classical and western music, traditional and contemporary dance, painting, and theatrical performances.",
        image: "/activity-arts.jpg",
        features: ["Music & Dance", "Art & Craft", "Drama & Theatre", "Bharatanatyam", "Hip-hop", "Folk Dances"],
    },
    {
        title: "Sports & Fitness",
        description: "Build physical strength, teamwork, and sportsmanship through our diverse sports program. From outdoor athletics to indoor games, we ensure every student finds their sporting passion.",
        image: "/activity-sports.jpg",
        features: ["Cricket", "Football", "Basketball", "Badminton", "Table Tennis", "Yoga & Meditation"],
    },
    {
        title: "Academic Clubs",
        description: "Extend learning beyond textbooks with hands-on exploration in science, mathematics, and technology. Our clubs foster innovation, critical thinking, and a love for discovery.",
        image: "/activity-clubs.jpg",
        features: ["Science Club", "Math Club", "Coding Club", "Robotics", "Quiz Team", "Tech Projects"],
    },
    {
        title: "Life Skills",
        description: "Develop essential skills for success in life through public speaking, leadership training, and community engagement. We prepare students to be confident, responsible citizens.",
        image: "/activity-lifeskills.jpg",
        features: ["Public Speaking", "Debates", "Model UN", "Student Council", "Community Service", "Eco Club"],
    },
];

const events = [
    { name: "Annual Day", month: "December", desc: "Grand celebration with performances and awards", icon: "🎉" },
    { name: "Sports Day", month: "January", desc: "Athletic events and inter-house competitions", icon: "🏆" },
    { name: "Science Fair", month: "February", desc: "Student projects and innovation showcase", icon: "🔬" },
    { name: "Cultural Fest", month: "March", desc: "Art, music, and dance performances", icon: "🎭" },
];

export default function ActivitiesPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#43a047] via-[#388e3c] to-[#2e7d32] relative overflow-hidden">
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

            {/* Activities Grid - Similar to Facilities */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src={activity.image}
                                            alt={activity.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                    <h3 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {activity.title}
                                    </h3>
                                    <p className="text-[#666] mb-6">{activity.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {activity.features.map((feature) => (
                                            <span key={feature} className="px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Annual Events - Similar to Additional Facilities */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Annual Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <motion.div
                                key={event.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                            >
                                <span className="text-4xl mb-3 block">{event.icon}</span>
                                <span className="text-xs font-medium bg-[#C4A35A]/10 text-[#C4A35A] px-3 py-1 rounded-full">{event.month}</span>
                                <h3 className="font-semibold text-[#333] mt-3 mb-2">{event.name}</h3>
                                <p className="text-[#666] text-sm">{event.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
