"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface WelcomeData {
    title?: string;
    paragraphs?: string[];
    intro1?: string;
    intro2?: string;
    signatureImage?: string;
    signatureText?: string;
    stats?: { number: string; label: string }[];
}

const defaultStats = [
    { number: "25+", label: "Years of Excellence" },
    { number: "1500+", label: "Happy Students" },
    { number: "80+", label: "Qualified Teachers" },
    { number: "100%", label: "Pass Rate" },
];

export default function WelcomePreviewPage() {
    const [data, setData] = useState<WelcomeData>({
        title: "Welcome to Our School",
        paragraphs: ["At our school, we believe every child is unique."],
        signatureText: "School Principal",
        stats: defaultStats
    });
    const ref = useRef(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "WELCOME_PREVIEW_UPDATE" && event.data.data) {
                const incoming = event.data.data;
                // Handle both old format (intro1, intro2) and new format (paragraphs)
                let paragraphs = incoming.paragraphs || [];
                if (paragraphs.length === 0) {
                    if (incoming.intro1) paragraphs.push(incoming.intro1);
                    if (incoming.intro2) paragraphs.push(incoming.intro2);
                }
                setData({
                    ...incoming,
                    paragraphs: paragraphs.length > 0 ? paragraphs : [""],
                    stats: incoming.stats || defaultStats
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_WELCOME_DATA" }, "*");
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const paragraphs = data.paragraphs || [];

    return (
        <section className="py-24 bg-white min-h-screen" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-semibold text-[#333] mb-8"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {data.title || "Welcome"}
                    </motion.h2>

                    {paragraphs.map((para, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                            className="text-[#666] text-base md:text-lg leading-relaxed mb-6"
                        >
                            {para}
                        </motion.p>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col items-center mt-8"
                    >
                        {data.signatureImage ? (
                            <div className="h-16 mb-2">
                                <img src={data.signatureImage} alt="Signature" className="h-full object-contain" />
                            </div>
                        ) : (
                            <svg viewBox="0 0 200 60" className="w-48 h-16 text-[#333]" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M10 40 Q20 20, 30 40 T50 40 Q60 35, 70 30 L75 30 Q85 28, 95 35 L100 35 Q110 30, 120 35 Q130 40, 140 35 L145 33 Q155 28, 165 30 L180 32" strokeLinecap="round" />
                            </svg>
                        )}
                        <span className="mt-2 text-sm text-[#888] italic">
                            {data.signatureText || "School Principal"}
                        </span>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
                >
                    {(data.stats || defaultStats).map((stat, index) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-[#C4A35A] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                                {stat.number}
                            </div>
                            <div className="text-sm text-[#666]">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-px bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent mx-auto mt-12"
                    style={{ maxWidth: "100px" }}
                />
            </div>
        </section>
    );
}
