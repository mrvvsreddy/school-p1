"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const activities = [
    {
        id: 1,
        title: "Music & Dance",
        description: "Classical and western music training, dance classes including Bharatanatyam, Hip-hop, and folk dances.",
        icon: "🎵",
        color: "#FFE4EC",
    },
    {
        id: 2,
        title: "Art & Craft",
        description: "Painting, sketching, clay modeling, origami, and various creative craft activities.",
        icon: "🎨",
        color: "#E4F4FF",
    },
    {
        id: 3,
        title: "Sports & Games",
        description: "Cricket, football, basketball, badminton, table tennis, chess, and carrom.",
        icon: "🏆",
        color: "#E4FFE4",
    },
    {
        id: 4,
        title: "Drama & Theatre",
        description: "Stage performances, acting workshops, script writing, and annual plays.",
        icon: "🎭",
        color: "#FFF4E4",
    },
    {
        id: 5,
        title: "Debate & Public Speaking",
        description: "Debates, elocution, Model UN, and personality development programs.",
        icon: "🎤",
        color: "#F4E4FF",
    },
    {
        id: 6,
        title: "Science Club",
        description: "Science experiments, robotics, coding workshops, and science exhibitions.",
        icon: "🔬",
        color: "#E4FFF4",
    },
    {
        id: 7,
        title: "Yoga & Meditation",
        description: "Daily yoga sessions, meditation practices, and wellness activities for mental health.",
        icon: "🧘",
        color: "#FFE4FF",
    },
    {
        id: 8,
        title: "Environmental Club",
        description: "Tree plantation drives, recycling projects, and environmental awareness campaigns.",
        icon: "🌱",
        color: "#E4FFEC",
    },
];

const ActivityCard = ({ activity, index }: { activity: typeof activities[0]; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
            {/* Icon */}
            <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: activity.color }}
            >
                {activity.icon}
            </motion.div>

            <h3
                className="text-lg font-semibold text-[#333] mb-2 group-hover:text-[#C4A35A] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
            >
                {activity.title}
            </h3>

            <p className="text-[#666] text-sm leading-relaxed">
                {activity.description}
            </p>
        </motion.div>
    );
};

export default function Activities() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="activities" className="py-24 bg-[#FAF8F5]" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium mb-4"
                    >
                        Beyond Academics
                    </motion.span>
                    <h2
                        className="text-3xl md:text-4xl font-semibold text-[#333] mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Extracurricular Activities
                    </h2>
                    <p className="text-[#666] max-w-2xl mx-auto">
                        We believe in holistic development. Our diverse range of extracurricular activities
                        helps students discover their talents and develop new skills.
                    </p>
                </motion.div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((activity, index) => (
                        <ActivityCard key={activity.id} activity={activity} index={index} />
                    ))}
                </div>

                {/* Annual Events Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { title: "Annual Day", date: "December", icon: "🎉", description: "Grand celebration with performances and awards" },
                        { title: "Sports Day", date: "January", icon: "🏅", description: "Athletic events and inter-house competitions" },
                        { title: "Science Fair", date: "February", icon: "🚀", description: "Student projects and innovation showcase" },
                    ].map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <span className="text-4xl">{event.icon}</span>
                            <div>
                                <h4 className="font-semibold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {event.title}
                                </h4>
                                <p className="text-xs text-[#C4A35A] font-medium uppercase tracking-wide mb-1">
                                    {event.date}
                                </p>
                                <p className="text-sm text-[#666]">{event.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <button className="btn-outline">View Activity Calendar</button>
                </motion.div>
            </div>
        </section>
    );
}
