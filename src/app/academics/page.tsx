"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const grades = [
    {
        level: "Primary School",
        classes: "Class 1 - 5",
        age: "6-10 years",
        description: "Building strong foundations with interactive learning, basic literacy, numeracy, and creative exploration.",
        subjects: ["English", "Hindi", "Mathematics", "EVS", "Art & Craft", "Computer Basics"],
        color: "from-[#43a047] to-[#66bb6a]",
    },
    {
        level: "Middle School",
        classes: "Class 6 - 8",
        age: "11-13 years",
        description: "Developing critical thinking, scientific inquiry, and preparing students for advanced learning.",
        subjects: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science"],
        color: "from-[#1e88e5] to-[#42a5f5]",
    },
    {
        level: "High School",
        classes: "Class 9 - 10",
        age: "14-16 years",
        description: "Comprehensive board exam preparation with focus on academics, career guidance, and competitive exams.",
        subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Applications"],
        color: "from-[#7b1fa2] to-[#ab47bc]",
    },
];

export default function AcademicsPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#004d40] via-[#00695c] to-[#00897b] relative overflow-hidden">
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
                        Academics
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Comprehensive curriculum designed to nurture curiosity and academic excellence.
                    </motion.p>
                </div>
            </section>

            {/* Grade Levels */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Our Academic Programs
                        </h2>
                        <p className="text-[#666] mt-4 max-w-2xl mx-auto">
                            Quality education from Class 1 to 10 with age-appropriate curriculum.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {grades.map((grade, index) => (
                            <motion.div
                                key={grade.level}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            >
                                <div className={`bg-gradient-to-r ${grade.color} p-6 text-white`}>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                                                {grade.level}
                                            </h3>
                                            <p className="text-white/80">{grade.classes} | Age: {grade.age}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-[#666] mb-4">{grade.description}</p>
                                    <div>
                                        <h4 className="font-semibold text-[#333] mb-2">Core Subjects:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {grade.subjects.map((subject) => (
                                                <span key={subject} className="px-3 py-1 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Teaching Methodology */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Teaching Methodology
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Interactive Learning", desc: "Smart boards and multimedia", icon: "📱" },
                            { title: "Project-Based", desc: "Hands-on experience", icon: "🔬" },
                            { title: "Individual Attention", desc: "Small class sizes", icon: "👤" },
                            { title: "Regular Assessment", desc: "Track progress continuously", icon: "📊" },
                        ].map((method) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-md"
                            >
                                <span className="text-3xl mb-3 block">{method.icon}</span>
                                <h3 className="font-semibold text-[#333] mb-1">{method.title}</h3>
                                <p className="text-[#666] text-sm">{method.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Calendar */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                            Academic Calendar 2024-25
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { term: "First Term", dates: "April - September", exams: "September" },
                                { term: "Second Term", dates: "October - March", exams: "March" },
                            ].map((term) => (
                                <div key={term.term} className="bg-[#FAF8F5] rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {term.term}
                                    </h3>
                                    <div className="space-y-2 text-[#666]">
                                        <p><span className="font-medium">Duration:</span> {term.dates}</p>
                                        <p><span className="font-medium">Examinations:</span> {term.exams}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
