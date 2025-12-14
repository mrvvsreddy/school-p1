"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Grade {
    id?: number;
    title?: string;
    level?: string;
    classes: string;
    description: string;
    color?: string;
    icon?: React.ReactNode | string;
}

const GradeCard = ({ grade, index }: { grade: Grade; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Top Color Bar */}
            <div
                className="h-2 w-full"
                style={{ backgroundColor: "#C4A35A" }}
            />

            {/* Content */}
            <div className="p-8">
                {/* Icon Circle */}
                {grade.icon && (
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[#C4A35A]"
                        style={{ backgroundColor: grade.color || "#f0f0f0" }}
                    >
                        {/* If icon is a string, rendering it might need a map. 
                            Use a generic fallback or expect JSX for now if passed from parent */}
                        {typeof grade.icon === 'string' ? <span className="text-2xl">{grade.icon}</span> : grade.icon}
                    </motion.div>
                )}

                <h3
                    className="text-2xl font-semibold text-[#333] mb-2 group-hover:text-[#C4A35A] transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    {grade.title || grade.level}
                </h3>

                <div className="text-[#C4A35A] font-semibold text-sm mb-4 uppercase tracking-wide">
                    {grade.classes}
                </div>

                <p className="text-[#666] text-sm leading-relaxed mb-6">
                    {grade.description}
                </p>

                {/* Learn More Button */}
                <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-[#C4A35A] font-medium text-sm group-hover:text-[#A38842] transition-colors"
                >
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </motion.button>
            </div>
        </motion.div>
    );
};

const Grades = ({ grades }: { grades: Grade[] }) => {
    if (!grades) return null;
    return (
        <div className="grid md:grid-cols-3 gap-8">
            {grades.map((grade, index) => (
                <GradeCard key={grade.id || index} grade={grade} index={index} />
            ))}
        </div>
    );
};

export default Grades;
