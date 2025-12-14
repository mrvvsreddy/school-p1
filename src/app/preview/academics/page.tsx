"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Grade {
    title: string;
    classes: string;
    age: string;
    description: string;
    image: string;
    features: string[];
}

interface Methodology {
    name: string;
    icon: string;
}

interface CalendarTerm {
    term: string;
    dates: string;
    exams: string;
}

interface AcademicsData {
    grades: Grade[];
    methodologies: Methodology[];
    calendar: CalendarTerm[];
}

const defaultData: AcademicsData = {
    grades: [
        {
            title: "Primary Wing",
            classes: "Class 1-5",
            age: "6-10 Years",
            description: "Building a strong foundation through activity-based learning.",
            image: "/academic-primary.jpg",
            features: ["Phonics", "Numeracy", "Arts"]
        }
    ],
    methodologies: [
        { name: "Experiential Learning", icon: "🧠" }
    ],
    calendar: [
        { term: "Term 1", dates: "April - September", exams: "September" }
    ]
};

export default function AcademicsPreviewPage() {
    const [data, setData] = useState<AcademicsData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "ACADEMICS_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    grades: received.grades || defaultData.grades,
                    methodologies: received.methodologies || defaultData.methodologies,
                    calendar: received.calendar || defaultData.calendar
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_ACADEMICS_DATA" }, "*");

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
            {/* Hero Banner (Static for preview consistency) */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#43a047] via-[#388e3c] to-[#2e7d32] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Academics</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">Comprehensive curriculum designed to nurture curiosity and academic excellence.</p>
                </div>
            </section>

            {/* Academic Programs */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {data.grades.map((grade, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                                        {grade.image ? (
                                            <Image
                                                src={grade.image}
                                                alt={grade.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
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
                                            {grade.features.map((feature, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium">
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
                        {data.methodologies.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl p-6 text-center shadow-md"
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
                            Academic Calendar
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {data.calendar.map((term, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#FAF8F5] rounded-xl p-6 shadow-md"
                                >
                                    <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {term.term}
                                    </h3>
                                    <div className="space-y-2 text-[#666]">
                                        <p><span className="font-medium text-[#333]">Duration:</span> {term.dates}</p>
                                        <p><span className="font-medium text-[#333]">Examinations:</span> {term.exams}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
