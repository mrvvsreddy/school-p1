"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import { WelcomeData } from "@/data/types";

interface WelcomeProps {
    data?: WelcomeData;
}

const defaultData: WelcomeData = {
    title: "Welcome to Balayeasu School",
    intro1: "At Balayeasu School, we believe every child is unique and deserves the best education. Our school provides comprehensive education from Class 1 to 10, combining academic excellence with character building in a safe and nurturing environment.",
    intro2: "With state-of-the-art facilities including a spacious playground, dedicated sports areas, and a variety of extracurricular activities, we ensure the holistic development of every student.",
    stats: [
        { number: "25+", label: "Years of Excellence" },
        { number: "1500+", label: "Happy Students" },
        { number: "80+", label: "Qualified Teachers" },
        { number: "100%", label: "Pass Rate" },
    ]
};

export default function Welcome({ data = defaultData }: WelcomeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="py-24 bg-white" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-semibold text-[#333] mb-8"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {data.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[#666] text-base md:text-lg leading-relaxed mb-6"
                    >
                        {data.intro1}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-[#666] text-base md:text-lg leading-relaxed mb-10"
                    >
                        {data.intro2}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col items-center"
                    >
                        {/* Signature SVG */}
                        <svg
                            viewBox="0 0 200 60"
                            className="w-48 h-16 text-[#333]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                d="M10 40 Q20 20, 30 40 T50 40 Q60 35, 70 30 L75 30 Q85 28, 95 35 L100 35 Q110 30, 120 35 Q130 40, 140 35 L145 33 Q155 28, 165 30 L180 32"
                                strokeLinecap="round"
                            />
                            <path
                                d="M50 42 Q55 50, 60 45"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="mt-2 text-sm text-[#888] italic">
                            School Principal
                        </span>
                    </motion.div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
                >
                    {data.stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-[#C4A35A] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                                {stat.number}
                            </div>
                            <div className="text-sm text-[#666]">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100px" } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-px bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent mx-auto mt-12"
                    style={{ maxWidth: "100px" }}
                />
            </div>
        </section>
    );
}
