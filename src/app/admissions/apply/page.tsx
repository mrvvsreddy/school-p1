"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";

const documents = [
    { id: 1, name: "Birth Certificate", required: true },
    { id: 2, name: "Previous School Report Card", required: true },
    { id: 3, name: "Transfer Certificate (if applicable)", required: false },
    { id: 4, name: "4 Passport Size Photos", required: true },
    { id: 5, name: "Aadhar Card (Student & Parents)", required: true },
    { id: 6, name: "Address Proof", required: true },
];

export default function ApplyPage() {
    const [formData, setFormData] = useState({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        dialCode: "+91",
        classApplying: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (phone: string, dialCode: string) => {
        setFormData({ ...formData, phone, dialCode });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log("Application submitted:", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen">
                <Header />
                <section className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                            Application Submitted!
                        </h2>
                        <p className="text-[#666] mb-8">
                            Thank you for your application. Our admissions team will contact you within 2-3 business days.
                        </p>
                        <Link
                            href="/admissions"
                            className="inline-block bg-[#7b1fa2] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6a1b9a] transition-colors"
                        >
                            Back to Admissions
                        </Link>
                    </motion.div>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-12 bg-gradient-to-br from-[#7b1fa2] via-[#8e24aa] to-[#9c27b0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <Link href="/admissions" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admissions
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Apply Now
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Complete the form below to start your admission journey.
                    </motion.p>
                </div>
            </section>

            {/* Application Form Section */}
            <section className="py-16 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Application Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Application Form
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#333] mb-2">
                                            Student&apos;s Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={formData.studentName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                            placeholder="Enter student's name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333] mb-2">
                                            Parent/Guardian Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                            placeholder="Enter parent's name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333] mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333] mb-2">
                                            Phone Number *
                                        </label>
                                        <PhoneInput
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            placeholder="Enter phone number"
                                            required
                                            defaultDialCode="+91"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333] mb-2">
                                            Class Applying For *
                                        </label>
                                        <select
                                            name="classApplying"
                                            value={formData.classApplying}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all bg-white"
                                        >
                                            <option value="">Select Class</option>
                                            <option value="1">Class 1</option>
                                            <option value="2">Class 2</option>
                                            <option value="3">Class 3</option>
                                            <option value="4">Class 4</option>
                                            <option value="5">Class 5</option>
                                            <option value="6">Class 6</option>
                                            <option value="7">Class 7</option>
                                            <option value="8">Class 8</option>
                                            <option value="9">Class 9</option>
                                            <option value="10">Class 10</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#7b1fa2] to-[#9c27b0] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#7b1fa2]/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Documents Required */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Documents Required
                                </h2>
                                <p className="text-[#666] mb-6">
                                    Please keep the following documents ready for submission:
                                </p>
                                <ul className="space-y-4">
                                    {documents.map((doc) => (
                                        <li key={doc.id} className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${doc.required ? 'bg-[#C4A35A]' : 'bg-gray-300'}`}>
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="text-[#333] font-medium">{doc.name}</span>
                                                {doc.required ? (
                                                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                                                ) : (
                                                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Optional</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Important Note */}
                                <div className="mt-8 p-4 bg-[#FAF8F5] rounded-xl border border-[#C4A35A]/30">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-[#C4A35A] rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#333] mb-1">Important Note</h4>
                                            <p className="text-sm text-[#666]">
                                                All documents should be submitted in original along with one photocopy during the admission process.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
