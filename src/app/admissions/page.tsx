"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const admissionSteps = [
    { step: 1, title: "Enquiry", desc: "Visit school or fill online enquiry form" },
    { step: 2, title: "Application", desc: "Submit application with required documents" },
    { step: 3, title: "Assessment", desc: "Student assessment and interaction" },
    { step: 4, title: "Confirmation", desc: "Admission confirmation and fee payment" },
];

const documents = [
    "Birth Certificate",
    "Previous School Report Card",
    "Transfer Certificate (if applicable)",
    "4 Passport Size Photos",
    "Aadhar Card (Student & Parents)",
    "Address Proof",
];

const feeStructure = [
    { class: "Class 1-5", admission: "₹15,000", tuition: "₹3,500/month" },
    { class: "Class 6-8", admission: "₹18,000", tuition: "₹4,000/month" },
    { class: "Class 9-10", admission: "₹20,000", tuition: "₹4,500/month" },
];

export default function AdmissionsPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#7b1fa2] via-[#8e24aa] to-[#9c27b0] relative overflow-hidden">
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
                        Admissions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Join our family of learners. Admissions open for 2024-25.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 bg-white text-[#7b1fa2] px-8 py-3 rounded-full font-semibold hover:bg-[#FAF8F5] transition-colors"
                    >
                        Apply Now
                    </motion.button>
                </div>
            </section>

            {/* Admission Process */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Admission Process
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {admissionSteps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-[#FAF8F5] rounded-2xl p-6 text-center">
                                    <div className="w-12 h-12 bg-[#C4A35A] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#333] mb-2">{item.title}</h3>
                                    <p className="text-[#666] text-sm">{item.desc}</p>
                                </div>
                                {index < admissionSteps.length - 1 && (
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
                                {documents.map((doc) => (
                                    <li key={doc} className="flex items-center gap-3">
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
                        Fee Structure 2024-25
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
                                    {feeStructure.map((fee, index) => (
                                        <tr key={fee.class} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}>
                                            <td className="px-6 py-4 font-medium text-[#333]">{fee.class}</td>
                                            <td className="px-6 py-4 text-[#666]">{fee.admission}</td>
                                            <td className="px-6 py-4 text-[#666]">{fee.tuition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[#666] text-sm mt-4 text-center">* Additional charges for transport, books, and uniform apply.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
