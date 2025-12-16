"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface FooterLink {
    name: string;
    href: string;
}

interface FooterData {
    contactTitle: string;
    contactInfo: string;
    phone: string;
    email: string;
    address: string;
    quickLinks: FooterLink[];
    academicLinks: FooterLink[];
    resourceLinks: FooterLink[];
}

const defaultData: FooterData = {
    contactTitle: "Get in Touch",
    contactInfo: "We're here to answer your questions and help you learn more about our school.",
    phone: "+91 98765 43210",
    email: "info@school.edu",
    address: "123 Education Lane, City, State 123456",
    quickLinks: [
        { name: "About Us", href: "/about" },
        { name: "Admissions", href: "/admissions" },
        { name: "Contact", href: "/contact" }
    ],
    academicLinks: [
        { name: "Curriculum", href: "/academics" },
        { name: "Classes", href: "/classes" },
        { name: "Faculty", href: "/faculty" }
    ],
    resourceLinks: [
        { name: "Gallery", href: "/gallery" },
        { name: "Events", href: "/events" },
        { name: "Downloads", href: "/downloads" }
    ]
};

export default function FooterPreviewPage() {
    const [data, setData] = useState<FooterData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "FOOTER_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    contactTitle: received.contactTitle || defaultData.contactTitle,
                    contactInfo: received.contactInfo || defaultData.contactInfo,
                    phone: received.phone || defaultData.phone,
                    email: received.email || defaultData.email,
                    address: received.address || defaultData.address,
                    quickLinks: received.quickLinks || [],
                    academicLinks: received.academicLinks || [],
                    resourceLinks: received.resourceLinks || []
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_FOOTER_DATA" }, "*");

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
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Footer Content</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">Manage your footer information and links.</p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span className="text-[#C4A35A] font-medium text-sm uppercase tracking-wider">Contact Us</span>
                            <h2 className="text-3xl md:text-4xl font-semibold text-[#333] mt-2 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                {data.contactTitle}
                            </h2>
                            <p className="text-[#666] mb-4">{data.contactInfo}</p>
                            <p className="text-[#666] mb-4">Feel free to reach out to us through any of the following channels.</p>
                            <p className="text-[#666]">We look forward to hearing from you.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-[#C4A35A] to-[#A38842] rounded-3xl p-8 text-white">
                            <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">📞</span>
                                    <span className="text-white/90">{data.phone}</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">✉️</span>
                                    <span className="text-white/90">{data.email}</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">📍</span>
                                    <span className="text-white/90">{data.address}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Links */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Footer Navigation
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg text-center"
                        >
                            <span className="text-4xl mb-4 block">🔗</span>
                            <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                Quick Links
                            </h3>
                            <ul className="text-[#666] space-y-2">
                                {data.quickLinks.map((link, i) => (
                                    <li key={i}>{link.name}</li>
                                ))}
                                {data.quickLinks.length === 0 && <li className="italic text-gray-400">No quick links added</li>}
                            </ul>
                        </motion.div>

                        {/* Academic Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg text-center"
                        >
                            <span className="text-4xl mb-4 block">📚</span>
                            <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                Academics
                            </h3>
                            <ul className="text-[#666] space-y-2">
                                {data.academicLinks.map((link, i) => (
                                    <li key={i}>{link.name}</li>
                                ))}
                                {data.academicLinks.length === 0 && <li className="italic text-gray-400">No academic links added</li>}
                            </ul>
                        </motion.div>

                        {/* Resource Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg text-center"
                        >
                            <span className="text-4xl mb-4 block">📖</span>
                            <h3 className="text-xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                Resources
                            </h3>
                            <ul className="text-[#666] space-y-2">
                                {data.resourceLinks.map((link, i) => (
                                    <li key={i}>{link.name}</li>
                                ))}
                                {data.resourceLinks.length === 0 && <li className="italic text-gray-400">No resource links added</li>}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Additional Information */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                            Stay Connected
                        </h2>
                        <p className="text-[#666] mt-4 max-w-2xl mx-auto">
                            Follow us on social media and stay updated with the latest news and events.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                f
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Facebook</h3>
                            <p className="text-[#666] text-sm mt-1">Follow our updates</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                𝕏
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Twitter</h3>
                            <p className="text-[#666] text-sm mt-1">Join the conversation</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                📷
                            </div>
                            <h3 className="text-lg font-semibold text-[#333]">Instagram</h3>
                            <p className="text-[#666] text-sm mt-1">View our gallery</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
