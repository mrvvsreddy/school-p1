"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";


interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    color: string;
}

const CourseCard = ({ course, index }: { course: Course; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Course Details Label */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-[#C4A35A] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                    COURSE DETAILS
                </motion.span>
                <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-[#C4A35A] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                    JOIN TODAY
                </motion.span>
            </div>

            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundColor: course.color }}
                >
                    {course.image && (
                        <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover opacity-90"
                            unoptimized
                        />
                    )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Plus Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-4 bottom-28 w-10 h-10 bg-[#C4A35A] rounded-full flex items-center justify-center shadow-lg hover:bg-[#A38842] transition-colors z-10"
            >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </motion.button>

            {/* Content */}
            <div className="p-6">
                <h3
                    className="text-xl font-semibold text-[#333] mb-2 group-hover:text-[#C4A35A] transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    {course.title}
                </h3>
                <p className="text-[#666] text-sm line-clamp-2">
                    {course.description}
                </p>
            </div>
        </motion.div>
    );
};

export default function Courses() {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/academics`);
                const json = await res.json();
                // We seeded courses to 'academics/courses'
                // The API returns { "courses": { "list": [...] }, ... }
                if (json && json.courses && json.courses.list) {
                    setCourses(json.courses.list);
                }
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };
        fetchData();
    }, []);

    if (courses.length === 0) return null;

    return (
        <section id="academics" className="py-24 bg-[#FAF8F5]" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2
                        className="text-3xl md:text-4xl font-semibold text-[#333]"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Our Courses
                    </h2>
                </motion.div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <button className="btn-outline">View All Course</button>
                </motion.div>
            </div>
        </section>
    );
}
