"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Academics", href: "#academics" },
    { name: "Facilities", href: "#facilities" },
    { name: "Activities", href: "#activities" },
    { name: "Admissions", href: "#admissions" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Left Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.slice(0, 3).map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className={`nav-link ${isScrolled ? "!text-[#333]" : "text-white"
                                    } hover:text-[#C4A35A] transition-colors`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Logo */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center"
                >
                    <Link href="/" className="flex flex-col items-center">
                        <div
                            className={`relative w-16 h-16 rounded-full border-2 ${isScrolled ? "border-[#333]" : "border-white"
                                } flex items-center justify-center`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 100 100"
                                    className={`w-12 h-12 ${isScrolled ? "text-[#333]" : "text-white"
                                        }`}
                                    fill="currentColor"
                                >
                                    <path d="M50 10 L60 30 H80 L65 45 L72 70 L50 55 L28 70 L35 45 L20 30 H40 Z" />
                                    <rect x="35" y="60" width="30" height="5" />
                                    <rect x="30" y="68" width="40" height="5" />
                                    <rect x="25" y="76" width="50" height="8" />
                                </svg>
                            </div>
                        </div>
                        <span
                            className={`mt-1 text-xs font-semibold tracking-widest ${isScrolled ? "text-[#333]" : "text-white"
                                }`}
                        >
                            BALAYEASU
                        </span>
                        <span
                            className={`text-[8px] tracking-[0.2em] ${isScrolled ? "text-[#666]" : "text-white/80"
                                }`}
                        >
                            SCHOOL
                        </span>
                    </Link>
                </motion.div>

                {/* Right Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.slice(3).map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            className="relative"
                        >
                            <Link
                                href={link.href}
                                className={`nav-link flex items-center gap-1 ${isScrolled ? "!text-[#333]" : "text-white"
                                    } hover:text-[#C4A35A] transition-colors`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`lg:hidden p-2 ${isScrolled ? "text-[#333]" : "text-white"}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white shadow-lg"
                    >
                        <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#333] py-2 hover:text-[#C4A35A] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
