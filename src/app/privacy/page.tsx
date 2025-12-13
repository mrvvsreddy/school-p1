"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#37474f] via-[#455a64] to-[#546e7a]">
                <div className="container mx-auto px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80"
                    >
                        Last updated: December 2024
                    </motion.p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg">
                        {[
                            {
                                title: "Information We Collect",
                                content: "We collect information you provide directly to us, such as when you fill out admission forms, contact us, or communicate with us. This may include names, contact information, and educational records.",
                            },
                            {
                                title: "How We Use Your Information",
                                content: "We use the information we collect to process admissions, communicate with parents and students, improve our services, and comply with legal obligations.",
                            },
                            {
                                title: "Information Security",
                                content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
                            },
                            {
                                title: "Data Retention",
                                content: "We retain student records as required by educational regulations and for the period necessary to fulfill the purposes outlined in this policy.",
                            },
                            {
                                title: "Your Rights",
                                content: "Parents and guardians have the right to access, correct, or request deletion of their child's personal information. Contact our office for such requests.",
                            },
                            {
                                title: "Contact Us",
                                content: "If you have questions about this Privacy Policy, please contact us at privacy@balayeasuschool.edu or visit our administrative office.",
                            },
                        ].map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="mb-8"
                            >
                                <h2 className="text-xl font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {section.title}
                                </h2>
                                <p className="text-[#666]">{section.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
