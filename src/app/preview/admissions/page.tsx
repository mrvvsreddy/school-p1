"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AdmissionStep {
    step: number;
    title: string;
    desc: string;
}

interface Fee {
    class: string;
    admission: string;
    tuition: string;
}

interface AdmissionsData {
    process: AdmissionStep[];
    documents: string[];
    feeStructure: Fee[];
    feeNote: string;
}

const defaultData: AdmissionsData = {
    process: [
        { step: 1, title: "Enquiry", desc: "Visit school or fill online enquiry form" },
        { step: 2, title: "Application", desc: "Submit application" }
    ],
    documents: [
        "Birth Certificate",
        "Previous School Report Card"
    ],
    feeStructure: [
        { class: "Class 1-5", admission: "₹15,000", tuition: "₹3,500/month" }
    ],
    feeNote: "* Additional charges for transport, books, and uniform apply."
};

export default function AdmissionsPreviewPage() {
    const [data, setData] = useState<AdmissionsData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "ADMISSIONS_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    process: received.process || defaultData.process,
                    documents: received.documents || defaultData.documents,
                    feeStructure: received.feeStructure || defaultData.feeStructure,
                    feeNote: received.feeNote !== undefined ? received.feeNote : defaultData.feeNote
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_ADMISSIONS_DATA" }, "*");

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
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#7b1fa2] via-[#8e24aa] to-[#9c27b0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        Admissions
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">
                        Join our family of learners. Admissions open.
                    </p>
                </div>
            </section>

            {/* Admission Process */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Admission Process
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {data.process.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-[#FAF8F5] rounded-2xl p-6 text-center h-full">
                                    <div className="w-12 h-12 bg-[#C4A35A] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#333] mb-2">{item.title}</h3>
                                    <p className="text-[#666] text-sm">{item.desc}</p>
                                </div>
                                {index < data.process.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#C4A35A] text-2xl">→</div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documents Required */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                            Documents Required
                        </h2>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <ul className="grid md:grid-cols-2 gap-4">
                                {data.documents.map((doc, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#C4A35A]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-[#666]">{doc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Structure */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Fee Structure
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-[#FAF8F5] rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-[#C4A35A] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Class</th>
                                        <th className="px-6 py-4 text-left">Admission Fee</th>
                                        <th className="px-6 py-4 text-left">Tuition Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.feeStructure.map((fee, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}>
                                            <td className="px-6 py-4 font-medium text-[#333]">{fee.class}</td>
                                            <td className="px-6 py-4 text-[#666]">{fee.admission}</td>
                                            <td className="px-6 py-4 text-[#666]">{fee.tuition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[#666] text-sm mt-4 text-center">{data.feeNote}</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
