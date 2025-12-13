"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const routes = [
    { route: "Route 1", areas: "Sector 1, 2, 3", timing: "7:00 AM" },
    { route: "Route 2", areas: "Sector 4, 5, 6", timing: "7:15 AM" },
    { route: "Route 3", areas: "Sector 7, 8, 9", timing: "7:00 AM" },
    { route: "Route 4", areas: "Old City, Market Area", timing: "6:45 AM" },
    { route: "Route 5", areas: "Industrial Area, Township", timing: "7:30 AM" },
];

export default function TransportPage() {
    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#00838f] via-[#0097a7] to-[#00acc1] relative overflow-hidden">
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
                        Transport Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Safe and reliable transport for your children.
                    </motion.p>
                </div>
            </section>

            {/* Transport Info */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                Our Fleet
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { icon: "🚌", title: "15+ School Buses", desc: "Well-maintained fleet of buses" },
                                    { icon: "👨‍✈️", title: "Trained Drivers", desc: "Experienced and licensed drivers" },
                                    { icon: "👩‍💼", title: "Bus Attendants", desc: "Female attendants on every bus" },
                                    { icon: "📍", title: "GPS Tracking", desc: "Real-time location tracking" },
                                    { icon: "📱", title: "Parent App", desc: "Track your child's bus live" },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-4 p-4 bg-[#FAF8F5] rounded-xl">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-[#333]">{item.title}</h3>
                                            <p className="text-[#666] text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                Bus Routes
                            </h2>
                            <div className="bg-[#FAF8F5] rounded-2xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#C4A35A] text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm">Route</th>
                                            <th className="px-4 py-3 text-left text-sm">Areas Covered</th>
                                            <th className="px-4 py-3 text-left text-sm">Pickup</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route, index) => (
                                            <tr key={route.route} className={index % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"}>
                                                <td className="px-4 py-3 font-medium text-[#333] text-sm">{route.route}</td>
                                                <td className="px-4 py-3 text-[#666] text-sm">{route.areas}</td>
                                                <td className="px-4 py-3 text-[#666] text-sm">{route.timing}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[#666] text-sm mt-4">* Contact office for detailed route information and fee structure.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
