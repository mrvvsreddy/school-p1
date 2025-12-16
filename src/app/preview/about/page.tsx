"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Milestone {
    year: string;
    event: string;
}

interface FoundationItem {
    icon: string;
    title: string;
    content: string;
}

interface Leader {
    name: string;
    role: string;
    exp: string;
    image?: string;
}

interface AboutData {
    storyTitle: string;
    storyIntro1: string;
    storyIntro2: string;
    storyIntro3: string;
    milestones: Milestone[];
    foundation: FoundationItem[];
    leadership: Leader[];
}

const defaultData: AboutData = {
    storyTitle: "Our Story",
    storyIntro1: "Founded with a vision to provide quality education.",
    storyIntro2: "We believe in nurturing every child's potential.",
    storyIntro3: "Our commitment to excellence drives everything we do.",
    milestones: [
        { year: "1998", event: "Founded with 50 students." },
        { year: "2005", event: "Expanded to new campus." },
        { year: "2015", event: "Awarded Best School in Region." }
    ],
    foundation: [
        { icon: "🎯", title: "Mission", content: "To empower students to become future leaders through excellence in education." },
        { icon: "👁️", title: "Vision", content: "To be a global center of learning known for innovation and values." },
        { icon: "⭐", title: "Values", content: "Integrity, Excellence, Respect, and Collaboration." }
    ],
    leadership: [
        { name: "Dr. Sarah Smith", role: "Principal", exp: "25+ Years Experience" },
        { name: "Prof. John Doe", role: "Vice Principal", exp: "20+ Years Experience" },
        { name: "Mrs. Jane Area", role: "Head of Academics", exp: "15+ Years Experience" }
    ]
};

export default function AboutPreviewPage() {
    const [data, setData] = useState<AboutData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "ABOUT_PREVIEW_UPDATE" && event.data.data) {
                // Merge received data with default structure to ensure array existence if data is partial
                const received = event.data.data;
                setData({
                    storyTitle: received.storyTitle || defaultData.storyTitle,
                    storyIntro1: received.storyIntro1 || defaultData.storyIntro1,
                    storyIntro2: received.storyIntro2 || defaultData.storyIntro2,
                    storyIntro3: received.storyIntro3 || defaultData.storyIntro3,
                    milestones: received.milestones || [],
                    foundation: received.foundation || [],
                    leadership: received.leadership || []
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_ABOUT_DATA" }, "*");

        // Report height update
        const heightUpdateInterval = setInterval(() => {
            if (document.body) {
                window.parent.postMessage({
                    type: "PREVIEW_HEIGHT_UPDATE",
                    height: document.body.scrollHeight
                }, "*");
            }
        }, 500);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearInterval(heightUpdateInterval);
        };
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Banner (Static for now as per design) */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>About Us</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">Learn about our history, mission, and the values that drive us.</p>
                </div>
            </section>

            {/* Our Story & Milestones */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Story */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span className="text-[#C4A35A] font-medium text-sm uppercase tracking-wider">Our Story</span>
                            <h2 className="text-3xl md:text-4xl font-semibold text-[#333] mt-2 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                {data.storyTitle}
                            </h2>
                            <p className="text-[#666] mb-4">{data.storyIntro1}</p>
                            <p className="text-[#666] mb-4">{data.storyIntro2}</p>
                            <p className="text-[#666]">{data.storyIntro3}</p>
                        </motion.div>

                        {/* Milestones */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-[#C4A35A] to-[#A38842] rounded-3xl p-8 text-white">
                            <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Key Milestones</h3>
                            <div className="space-y-4">
                                {data.milestones.map((milestone, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">{milestone.year}</span>
                                        <span className="text-white/90">{milestone.event}</span>
                                    </div>
                                ))}
                                {data.milestones.length === 0 && <p className="text-white/70 italic">No milestones added yet.</p>}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Foundation */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Our Foundation
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {data.foundation.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
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
                        {data.leadership.map((leader, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                    {leader.image ? (
                                        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                                    ) : (
                                        (leader.name || "A").split(' ').map(n => n[0]).join('').slice(0, 2)
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
        </main>
    );
}
