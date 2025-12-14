"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhoneInput from "@/components/PhoneInput"; // Assuming we can reuse this or mock it for preview if strict

// Mock simple input for preview avoiding dependencies if needed, but imported one exists
// For preview purpose, we just need to display the Contact Info sections

interface ContactInfo {
    address: string;
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
    officeHours: string;
}

interface ContactData {
    heroTitle: string;
    heroDesc: string;
    contactInfo: ContactInfo;
}

const defaultData: ContactData = {
    heroTitle: "Contact Us",
    heroDesc: "We'd love to hear from you. Get in touch with us.",
    contactInfo: {
        address: "123 Education Lane\nCity, State - 123456",
        phone1: "+91 98765 43210",
        phone2: "+91 12345 67890",
        email1: "info@balayeasuschool.edu",
        email2: "admissions@balayeasuschool.edu",
        officeHours: "Monday - Friday: 8:00 AM - 4:00 PM\nSaturday: 9:00 AM - 1:00 PM"
    }
};

export default function ContactPreviewPage() {
    const [data, setData] = useState<ContactData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CONTACT_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    heroTitle: received.heroTitle || defaultData.heroTitle,
                    heroDesc: received.heroDesc || defaultData.heroDesc,
                    contactInfo: { ...defaultData.contactInfo, ...received.contactInfo }
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_CONTACT_DATA" }, "*");

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
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#1e88e5] via-[#1976d2] to-[#1565c0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        {data.heroTitle}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">
                        {data.heroDesc}
                    </p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                                Get in Touch
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C4A35A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#333] mb-1">Address</h3>
                                        <p className="text-[#666] whitespace-pre-line">{data.contactInfo.address}</p>
                                    </div>
                                </div>

                                {/* Phone & Email in 2 columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#C4A35A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#333] mb-1">Phone</h3>
                                            <p className="text-[#666]">{data.contactInfo.phone1}<br />{data.contactInfo.phone2}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#C4A35A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#333] mb-1">Email</h3>
                                            <p className="text-[#666]">{data.contactInfo.email1}<br />{data.contactInfo.email2}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C4A35A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#333] mb-1">Office Hours</h3>
                                        <p className="text-[#666] whitespace-pre-line">{data.contactInfo.officeHours}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form Placeholder */}
                        <div className="bg-[#FAF8F5] rounded-2xl p-8 opacity-50">
                            <h2 className="text-2xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                Send us a Message
                            </h2>
                            <p className="text-gray-500 italic">Contact form is functional in live site.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
