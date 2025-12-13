"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const calendarEvents = [
    { month: "April", events: ["School Reopens (1st)", "New Session Orientation (3rd-5th)"] },
    { month: "May", events: ["Summer Camp (1st-20th)", "Summer Vacation (21st onwards)"] },
    { month: "June", events: ["Summer Vacation continues", "School Reopens (15th)"] },
    { month: "July", events: ["Parent-Teacher Meeting (15th)", "Inter-House Quiz (25th)"] },
    { month: "August", events: ["Independence Day (15th)", "Raksha Bandhan Holiday"] },
    { month: "September", events: ["Half Yearly Exams (15th-25th)", "Teacher's Day (5th)"] },
    { month: "October", events: ["Dussehra Holidays", "Report Card Distribution"] },
    { month: "November", events: ["Diwali Holidays", "Children's Day (14th)"] },
    { month: "December", events: ["Annual Day (15th)", "Winter Vacation (24th onwards)"] },
    { month: "January", events: ["School Reopens (2nd)", "Sports Day (26th)"] },
    { month: "February", events: ["Science Fair (15th)", "Board Exam Preparation"] },
    { month: "March", events: ["Annual Exams (1st-15th)", "Result Declaration (25th)"] },
];

export default function CalendarPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#5e35b1] via-[#7e57c2] to-[#9575cd] relative overflow-hidden">
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
                        Academic Calendar 2024-25
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Important dates and events throughout the academic year.
                    </motion.p>
                </div>
            </section>

            {/* Calendar Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {calendarEvents.map((item, index) => (
                            <motion.div
                                key={item.month}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#FAF8F5] rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold text-[#C4A35A] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {item.month}
                                </h3>
                                <ul className="space-y-2">
                                    {item.events.map((event, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[#666] text-sm">
                                            <span className="w-1.5 h-1.5 bg-[#C4A35A] rounded-full mt-1.5 flex-shrink-0" />
                                            {event}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
