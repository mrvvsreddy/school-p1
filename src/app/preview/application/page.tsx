"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

interface ApplicationData {
    pageTitle: string;
    pageSubtitle: string;
    formFields: FormField[];
    documents: Document[];
    classOptions: ClassOption[];
    submitButtonText: string;
    importantNote: string;
}

const defaultData: ApplicationData = {
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
    importantNote: "All documents should be submitted in original along with one photocopy during the admission process."
};

export default function ApplicationPreviewPage() {
    const [data, setData] = useState<ApplicationData>(defaultData);
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "APPLICATION_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    pageTitle: received.pageTitle || defaultData.pageTitle,
                    pageSubtitle: received.pageSubtitle || defaultData.pageSubtitle,
                    formFields: received.formFields || defaultData.formFields,
                    documents: received.documents || defaultData.documents,
                    classOptions: received.classOptions || defaultData.classOptions,
                    submitButtonText: received.submitButtonText || defaultData.submitButtonText,
                    importantNote: received.importantNote || defaultData.importantNote
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_APPLICATION_DATA" }, "*");

        // Report height update
        const heightUpdateInterval = setInterval(() => {
            if (document.body) {
                window.parent.postMessage({
                    type: "PREVIEW_HEIGHT_UPDATE",
                    height: document.body.scrollHeight
                }, "*");
            }
        }, 500);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearInterval(heightUpdateInterval);
        };
    }, []);

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormValues({ ...formValues, [fieldName]: value });
    };

    const renderFormField = (field: FormField) => {
        const value = formValues[field.name] || "";

        switch (field.type) {
            case "phone":
                return (
                    <PhoneInput
                        value={value}
                        onChange={(phone) => handleFieldChange(field.name, phone)}
                        placeholder={field.placeholder}
                        defaultDialCode={field.defaultDialCode || "+91"}
                    />
                );
            case "select":
                return (
                    <select
                        name={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all bg-white"
                    >
                        <option value="">{field.placeholder}</option>
                        {data.classOptions.map((opt) => (
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="pt-32 pb-12 bg-gradient-to-br from-[#7b1fa2] via-[#8e24aa] to-[#9c27b0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        {data.pageTitle}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {data.pageSubtitle}
                    </p>
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
                                <form className="space-y-5">
                                    {data.formFields.map((field) => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-medium text-[#333] mb-2">
                                                {field.label} {field.required && "*"}
                                            </label>
                                            {renderFormField(field)}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="w-full bg-gradient-to-r from-[#7b1fa2] to-[#9c27b0] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#7b1fa2]/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        {data.submitButtonText}
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
                                    {data.documents.map((doc) => (
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
                                                {data.importantNote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
