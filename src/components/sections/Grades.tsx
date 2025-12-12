"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const grades = [
    {
        id: 1,
        level: "Primary",
        classes: "Class 1 - 5",
        description: "Building strong foundations with interactive learning, basic literacy, numeracy, and creative exploration.",
        color: "#E8F4E8",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        id: 2,
        level: "Middle School",
        classes: "Class 6 - 8",
        description: "Developing critical thinking, scientific inquiry, and preparing students for advanced learning.",
        color: "#E8F0F8",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        id: 3,
        level: "High School",
        classes: "Class 9 - 10",
        description: "Comprehensive board exam preparation with focus on academics, career guidance, and competitive exams.",
        color: "#F8F0E8",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
];

const GradeCard = ({ grade, index }: { grade: typeof grades[0]; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Top Color Bar */}
            <div
                className="h-2 w-full"
                style={{ backgroundColor: "#C4A35A" }}
            />

            {/* Content */}
            <div className="p-8">
                {/* Icon Circle */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[#C4A35A]"
                    style={{ backgroundColor: grade.color }}
                >
                    {grade.icon}
                </motion.div>

                <h3
                    className="text-2xl font-semibold text-[#333] mb-2 group-hover:text-[#C4A35A] transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    {grade.level}
                </h3>

                <div className="text-[#C4A35A] font-semibold text-sm mb-4 uppercase tracking-wide">
                    {grade.classes}
                </div>

                <p className="text-[#666] text-sm leading-relaxed mb-6">
                    {grade.description}
                </p>

                {/* Learn More Button */}
                <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-[#C4A35A] font-medium text-sm group-hover:text-[#A38842] transition-colors"
                >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default function Grades() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="academics" className="py-24 bg-[#FAF8F5]" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2
                        className="text-3xl md:text-4xl font-semibold text-[#333] mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Our Academic Programs
                    </h2>
                    <p className="text-[#666] max-w-2xl mx-auto">
                        Comprehensive education from Class 1 to 10 with age-appropriate curriculum designed to nurture curiosity and academic excellence.
                    </p>
                </motion.div>

                {/* Grade Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {grades.map((grade, index) => (
                        <GradeCard key={grade.id} grade={grade} index={index} />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <button className="btn-primary">Download Curriculum</button>
                </motion.div>
            </div>
        </section>
    );
}
