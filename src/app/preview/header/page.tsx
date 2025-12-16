"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface NavLink {
    name: string;
    href: string;
}

interface HeaderData {
    logoTitle: string;
    logoDescription: string;
    logoImage: string;
    navigationTitle: string;
    navLinks: NavLink[];
    brandingNote: string;
}

const defaultData: HeaderData = {
    logoTitle: "School Branding",
    logoDescription: "Your school logo represents your identity and values.",
    logoImage: "",
    navigationTitle: "Main Navigation",
    navLinks: [
        { name: "About", href: "/about" },
        { name: "Academics", href: "/academics" },
        { name: "Facilities", href: "/facilities" },
        { name: "Activities", href: "/activities" },
        { name: "Admissions", href: "/admissions" },
        { name: "Contact", href: "/contact" }
    ],
    brandingNote: "The header is the first thing visitors see. Make sure your logo is clear and navigation is intuitive."
};

export default function HeaderPreviewPage() {
    const [data, setData] = useState<HeaderData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "HEADER_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    logoTitle: received.logoTitle || defaultData.logoTitle,
                    logoDescription: received.logoDescription || defaultData.logoDescription,
                    logoImage: received.logoImage || defaultData.logoImage,
                    navigationTitle: received.navigationTitle || defaultData.navigationTitle,
                    navLinks: received.navLinks || [],
                    brandingNote: received.brandingNote || defaultData.brandingNote
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_HEADER_DATA" }, "*");

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
            {/* Hero Banner */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#43a047] via-[#388e3c] to-[#2e7d32] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Header Content</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">Customize your website header and navigation.</p>
                </div>
            </section>

            {/* Logo Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span className="text-[#C4A35A] font-medium text-sm uppercase tracking-wider">School Logo</span>
                            <h2 className="text-3xl md:text-4xl font-semibold text-[#333] mt-2 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                {data.logoTitle}
                            </h2>
                            <p className="text-[#666] mb-4">{data.logoDescription}</p>
                            <p className="text-[#666] mb-4">Upload a high-quality PNG or SVG file for best results.</p>
                            <p className="text-[#666]">Recommended size: 200x60 pixels.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-[#C4A35A] to-[#A38842] rounded-3xl p-8 text-white">
                            <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Logo Preview</h3>
                            <div className="bg-white/20 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
                                {data.logoImage ? (
                                    <div className="relative w-full h-32">
                                        <Image
                                            src={data.logoImage}
                                            alt="School Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-4xl">🏫</span>
                                        </div>
                                        <p className="text-white/70 italic">No logo uploaded</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Navigation Links */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            {data.navigationTitle}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {data.navLinks.map((link, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg text-center"
                            >
                                <span className="text-4xl mb-4 block">🔗</span>
                                <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {link.name}
                                </h3>
                                <p className="text-[#666] text-sm">{link.href}</p>
                            </motion.div>
                        ))}
                        {data.navLinks.length === 0 && (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-[#999] italic text-lg">No navigation links configured</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Branding Tips */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Branding Guidelines
                        </h2>
                        <p className="text-[#666] mt-4 max-w-2xl mx-auto">
                            Tips for creating an effective header for your school website.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                🎨
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Clear Logo</h3>
                            <p className="text-[#666] text-sm mt-1">Use a high-resolution logo</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                🧭
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Easy Navigation</h3>
                            <p className="text-[#666] text-sm mt-1">Keep menu items clear</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                📱
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Mobile Friendly</h3>
                            <p className="text-[#666] text-sm mt-1">Responsive on all devices</p>
                        </motion.div>
                    </div>
                    <div className="mt-12 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#FAF8F5] rounded-2xl p-8 border border-[#C4A35A]/30"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#C4A35A] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>Pro Tip</h3>
                                    <p className="text-[#666]">{data.brandingNote}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
