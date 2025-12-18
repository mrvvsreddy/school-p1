"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaView from "@/components/MediaView";
import { AcademicsData } from "@/data/types";

export default function AcademicsPage() {
    const [academics, setAcademics] = useState<AcademicsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/api/pages/academics`)
            .then((res) => res.json())
            .then((data) => {
                // Handle both API structures:
                // 1. data.academics (from editor which saves as { academics: {...} })
                // 2. data.grades.list (legacy structure)
                const academicsData = data.academics || data;
                const mappedData = {
                    grades: academicsData.grades?.list || academicsData.grades || [],
                    calendar: academicsData.calendar?.list || academicsData.calendar || [],
                    methodologies: academicsData.methodologies?.list || academicsData.methodologies || []
                };
                setAcademics(mappedData);
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

    if (!academics) {
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

            {/* Academic Programs */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {academics.grades.map((grade, index) => (
                            <motion.div
                                key={grade.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                                        <MediaView
                                            src={grade.image}
                                            alt={grade.title}
                                            containerClassName="w-full h-full"
                                        />
                                    </div>
                                </div>
                                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                    <div className="mb-2">
                                        <span className="px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full text-sm font-medium">
                                            {grade.classes} | Age: {grade.age}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {grade.title}
                                    </h3>
                                    <p className="text-[#666] mb-6">{grade.description}</p>
                                    <div>
                                        <h4 className="font-semibold text-[#333] mb-3">Core Subjects:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {grade.features.map((feature) => (
                                                <span key={feature} className="px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium">
                                                    {feature}
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
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Teaching Methodology
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {academics.methodologies.map((method) => (
                            <motion.div
                                key={method.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                            >
                                <span className="text-4xl mb-3 block">{method.icon}</span>
                                <h3 className="font-semibold text-[#333]">{method.name}</h3>
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
                            {academics.calendar.map((term, index) => (
                                <motion.div
                                    key={term.title || term.term || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-[#FAF8F5] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {term.title || term.term}
                                    </h3>
                                    <div className="space-y-2 text-[#666]">
                                        {/* Handle dynamic fields */}
                                        {term.fields && term.fields.map((field: { label: string; value: string }, fi: number) => (
                                            <p key={fi}><span className="font-medium text-[#333]">{field.label}:</span> {field.value}</p>
                                        ))}
                                        {/* Fallback for old format */}
                                        {!term.fields && term.dates && (
                                            <p><span className="font-medium text-[#333]">Duration:</span> {term.dates}</p>
                                        )}
                                        {!term.fields && term.exams && (
                                            <p><span className="font-medium text-[#333]">Examinations:</span> {term.exams}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
