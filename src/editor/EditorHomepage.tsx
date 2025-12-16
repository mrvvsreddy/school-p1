"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface PageData {
    id: string;
    name: string;
    description: string;
    icon: string;
    image?: string;
    route: string;
}

const pages: PageData[] = [
    {
        id: "home",
        name: "Homepage",
        description: "Edit Hero, Welcome, Facilities, and Playground sections",
        icon: "🏠",
        route: "/editor/home",
        image: "/hero-bg-1.jpg"
    },
    {
        id: "header",
        name: "Header",
        description: "Edit navigation menu and logo",
        icon: "📌",
        route: "/editor/header"
    },
    {
        id: "footer",
        name: "Footer",
        description: "Edit footer links, contact info, and social media",
        icon: "📄",
        route: "/editor/footer"
    },
    {
        id: "about",
        name: "About Page",
        description: "Edit school history, milestones, and leadership",
        icon: "📖",
        route: "/editor/about",
        image: "/hero-bg-2.jpg"
    },
    {
        id: "academics",
        name: "Academics",
        description: "Manage academic programs, grades, and calendar",
        icon: "🎓",
        route: "/editor/academics",
        image: "/academic-middle.jpg"
    },
    {
        id: "facilities",
        name: "Facilities",
        description: "Update campus facilities and infrastructure details",
        icon: "🏫",
        route: "/editor/facilities",
        image: "/facility-playground.jpg"
    },
    {
        id: "activities",
        name: "Activities",
        description: "Manage extracurricular activities and events",
        icon: "🎨",
        route: "/editor/activities",
        image: "/activity-arts.jpg"
    },
    {
        id: "admissions",
        name: "Admissions",
        description: "Edit admission process, documents, and fee structure",
        icon: "📝",
        route: "/editor/admissions",
        image: "/facility-classroom.jpg"
    },
    {
        id: "application",
        name: "Application Form",
        description: "Edit admission form documents, class options, and messages",
        icon: "📋",
        route: "/editor/application",
        image: "/facility-classroom.jpg"
    },
    {
        id: "gallery",
        name: "Gallery",
        description: "Upload and organize school photo gallery",
        icon: "🖼️",
        route: "/editor/gallery",
        image: "/hero-bg-3.jpg"
    },
    {
        id: "contact",
        name: "Contact Us",
        description: "Update school contact info, address, and timings",
        icon: "📞",
        route: "/editor/contact",
        image: "/facility-computer.jpg"
    }
];

export default function EditorHomepage() {
    const [pageImages, setPageImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch content to get images for each section
        fetch("/api/content")
            .then((res) => res.json())
            .then((data) => {
                const images: Record<string, string> = {};

                // Hero - get first slide image
                if (data.hero?.slides?.[0]?.image) {
                    images.hero = data.hero.slides[0].image;
                }

                // Facilities - get first facility image
                if (data.facilities?.facilities?.[0]?.image) {
                    images.facilities = data.facilities.facilities[0].image;
                }

                // Academics - get first grade image
                if (data.academics?.grades?.[0]?.image) {
                    images.academics = data.academics.grades[0].image;
                }

                // Activities - get first activity image
                if (data.activities?.activities?.[0]?.image) {
                    images.activities = data.activities.activities[0].image;
                }

                // Gallery - get first image
                if (data.gallery?.galleryImages?.[0]?.src) {
                    images.gallery = data.gallery.galleryImages[0].src;
                }

                setPageImages(images);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/school-admin" className="flex items-center gap-2 text-gray-500 hover:text-[#C4A35A] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Back to Admin</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-[#C4A35A] to-[#8B7355] rounded-lg flex items-center justify-center text-white text-sm">E</span>
                            Site Editor
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Site Editor
                    </motion.h1>
                    <motion.p
                        className="text-gray-500 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Select a page to edit its content
                    </motion.p>
                </div>

                {/* Page Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page, index) => (
                        <motion.div
                            key={page.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link href={page.route}>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#C4A35A]/30 transition-all duration-300 cursor-pointer group h-full">
                                    {/* Image Container */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                                        {loading ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div>
                                            </div>
                                        ) : (pageImages[page.id] || page.image) ? (
                                            <Image
                                                src={(pageImages[page.id] || page.image)!}
                                                alt={page.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-6xl opacity-30 group-hover:opacity-50 transition-opacity">
                                                    {page.icon}
                                                </span>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Edit Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <span className="text-sm font-medium text-[#C4A35A] flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">{page.icon}</span>
                                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#C4A35A] transition-colors">
                                                {page.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {page.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                                            Click to edit
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-gray-300 group-hover:text-[#C4A35A] group-hover:translate-x-1 transition-all"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Stats */}
                <motion.div
                    className="mt-12 bg-gradient-to-br from-[#C4A35A]/5 to-[#C4A35A]/10 rounded-2xl p-6 border border-[#C4A35A]/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#C4A35A]">{pages.length}</div>
                            <div className="text-sm text-gray-500">Total Pages</div>
                        </div>
                        <div className="h-10 w-px bg-[#C4A35A]/20 hidden md:block"></div>
                        <div>
                            <div className="text-3xl font-bold text-[#C4A35A]">Real-time</div>
                            <div className="text-sm text-gray-500">Content Sync</div>
                        </div>
                        <div className="h-10 w-px bg-[#C4A35A]/20 hidden md:block"></div>
                        <div>
                            <div className="text-3xl font-bold text-[#C4A35A]">Instant</div>
                            <div className="text-sm text-gray-500">Save & Preview</div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
