"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";

interface Document {
    id: number;
    name: string;
    required: boolean;
}

interface ClassOption {
    value: string;
    label: string;
}

interface FormField {
    id: number;
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    defaultDialCode?: string;
}

interface PageConfig {
    pageTitle: string;
    pageSubtitle: string;
    formFields: FormField[];
    documents: Document[];
    classOptions: ClassOption[];
    submitButtonText: string;
    importantNote: string;
    successMessage: string;
}

const defaultConfig: PageConfig = {
    pageTitle: "Apply Now",
    pageSubtitle: "Complete the form below to start your admission journey.",
    formFields: [
        { id: 1, name: "studentName", label: "Student's Full Name", type: "text", placeholder: "Enter student's name", required: true },
        { id: 2, name: "parentName", label: "Parent/Guardian Name", type: "text", placeholder: "Enter parent's name", required: true },
        { id: 3, name: "email", label: "Email Address", type: "email", placeholder: "Enter email address", required: true },
        { id: 4, name: "phone", label: "Phone Number", type: "phone", placeholder: "Enter phone number", required: true, defaultDialCode: "+91" },
        { id: 5, name: "classApplying", label: "Class Applying For", type: "select", placeholder: "Select Class", required: true },
    ],
    documents: [
        { id: 1, name: "Birth Certificate", required: true },
        { id: 2, name: "Previous School Report Card", required: true },
        { id: 3, name: "Transfer Certificate (if applicable)", required: false },
        { id: 4, name: "4 Passport Size Photos", required: true },
        { id: 5, name: "Aadhar Card (Student & Parents)", required: true },
        { id: 6, name: "Address Proof", required: true },
    ],
    classOptions: [
        { value: "1", label: "Class 1" },
        { value: "2", label: "Class 2" },
        { value: "3", label: "Class 3" },
        { value: "4", label: "Class 4" },
        { value: "5", label: "Class 5" },
        { value: "6", label: "Class 6" },
        { value: "7", label: "Class 7" },
        { value: "8", label: "Class 8" },
        { value: "9", label: "Class 9" },
        { value: "10", label: "Class 10" },
    ],
    submitButtonText: "Submit Application",
    importantNote: "All documents should be submitted in original along with one photocopy during the admission process.",
    successMessage: "Thank you for your application. Our admissions team will contact you within 2-3 business days."
};

export default function ApplyPage() {
    const [config, setConfig] = useState<PageConfig>(defaultConfig);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [dialCode, setDialCode] = useState("+91");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch page configuration from database
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/admissions`);
                const json = await res.json();
                const formData = json.application_form || {};
                setConfig({
                    pageTitle: formData.pageTitle || defaultConfig.pageTitle,
                    pageSubtitle: formData.pageSubtitle || defaultConfig.pageSubtitle,
                    formFields: formData.formFields || defaultConfig.formFields,
                    documents: formData.documents || defaultConfig.documents,
                    classOptions: formData.classOptions || defaultConfig.classOptions,
                    submitButtonText: formData.submitButtonText || defaultConfig.submitButtonText,
                    importantNote: formData.importantNote || defaultConfig.importantNote,
                    successMessage: formData.successMessage || defaultConfig.successMessage
                });
            } catch (error) {
                console.error("Failed to load page config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormValues({ ...formValues, [fieldName]: value });
    };

    const handlePhoneChange = (phone: string, code: string) => {
        setFormValues({ ...formValues, phone });
        setDialCode(code);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_name: formValues.studentName || "",
                    parent_name: formValues.parentName || "",
                    email: formValues.email || "",
                    phone: `${dialCode} ${formValues.phone || ""}`,
                    grade_applying: `Class ${formValues.classApplying}` || "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to submit application');
            }

            const result = await response.json();
            console.log("Application submitted:", result);
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting application:", err);
            setError(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormField = (field: FormField) => {
        const value = formValues[field.name] || "";

        switch (field.type) {
            case "phone":
                return (
                    <PhoneInput
                        value={value}
                        onChange={handlePhoneChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        defaultDialCode={field.defaultDialCode || "+91"}
                    />
                );
            case "select":
                return (
                    <select
                        name={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all bg-white"
                    >
                        <option value="">{field.placeholder}</option>
                        {config.classOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case "textarea":
                return (
                    <textarea
                        name={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all resize-none"
                        placeholder={field.placeholder}
                        rows={4}
                    />
                );
            case "email":
            case "text":
            default:
                return (
                    <input
                        type={field.type === "email" ? "email" : "text"}
                        name={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                        placeholder={field.placeholder}
                    />
                );
        }
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
                            {config.successMessage}
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

    if (loading) {
        return (
            <main className="min-h-screen">
                <Header />
                <section className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#7b1fa2]/30 border-t-[#7b1fa2] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading...</p>
                    </div>
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
                        {config.pageTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        {config.pageSubtitle}
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
                                    {config.formFields.map((field) => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-medium text-[#333] mb-2">
                                                {field.label} {field.required && "*"}
                                            </label>
                                            {renderFormField(field)}
                                        </div>
                                    ))}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-[#7b1fa2] to-[#9c27b0] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#7b1fa2]/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            config.submitButtonText
                                        )}
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
                                    {config.documents.map((doc) => (
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
                                                {config.importantNote}
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
