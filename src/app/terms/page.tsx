"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
                        Terms of Service
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
                                title: "Admission Terms",
                                content: "Admission to Balayeasu School is subject to availability of seats and fulfillment of admission criteria. The school reserves the right to refuse admission without assigning any reason.",
                            },
                            {
                                title: "Fee Payment",
                                content: "Fees must be paid by the 10th of each month. Late payment will attract a penalty. Fee once paid is non-refundable except as per the school's refund policy.",
                            },
                            {
                                title: "Code of Conduct",
                                content: "Students are expected to maintain discipline and follow the school's code of conduct. Any violation may result in disciplinary action including suspension or expulsion.",
                            },
                            {
                                title: "Attendance",
                                content: "Regular attendance is mandatory. A minimum of 75% attendance is required to appear for examinations. Leave applications must be submitted in advance.",
                            },
                            {
                                title: "Examination Rules",
                                content: "Students must appear for all examinations. Use of unfair means will result in cancellation of the examination and disciplinary action.",
                            },
                            {
                                title: "Withdrawal",
                                content: "Parents must give one month's notice for withdrawal. Transfer certificate will be issued only after clearing all dues.",
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
