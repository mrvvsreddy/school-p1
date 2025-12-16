"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Types ---
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
    successMessage: string;
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
    importantNote: "All documents should be submitted in original along with one photocopy during the admission process.",
    successMessage: "Thank you for your application. Our admissions team will contact you within 2-3 business days."
};

export default function ApplicationEditorPage() {
    const [data, setData] = useState<ApplicationData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    // Initial load
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/api/pages/admissions`)
            .then((res) => res.json())
            .then((content) => {
                const formData = content.application_form || {};
                const loadedData: ApplicationData = {
                    pageTitle: formData.pageTitle || defaultData.pageTitle,
                    pageSubtitle: formData.pageSubtitle || defaultData.pageSubtitle,
                    formFields: formData.formFields || defaultData.formFields,
                    documents: formData.documents || defaultData.documents,
                    classOptions: formData.classOptions || defaultData.classOptions,
                    submitButtonText: formData.submitButtonText || defaultData.submitButtonText,
                    importantNote: formData.importantNote || defaultData.importantNote,
                    successMessage: formData.successMessage || defaultData.successMessage
                };
                setData(loadedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Sync preview
    useEffect(() => {
        const sendPreviewData = () => {
            const message = { type: "APPLICATION_PREVIEW_UPDATE", data };
            iframeRef.current?.contentWindow?.postMessage(message, "*");
            fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
        };
        sendPreviewData();
    }, [data]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_APPLICATION_DATA") {
                const message = { type: "APPLICATION_PREVIEW_UPDATE", data };
                iframeRef.current?.contentWindow?.postMessage(message, "*");
                fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [data]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/pages/admissions/batch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: { application_form: data } }),
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Changes published successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    // --- Form Field Helpers ---
    const addFormField = () => {
        const newId = data.formFields.length > 0 ? Math.max(...data.formFields.map(f => f.id)) + 1 : 1;
        setData({
            ...data,
            formFields: [...data.formFields, { id: newId, name: `field${newId}`, label: "New Field", type: "text", placeholder: "Enter value", required: false }]
        });
    };

    const updateFormField = (index: number, field: keyof FormField, value: string | boolean) => {
        const newFields = [...data.formFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setData({ ...data, formFields: newFields });
    };

    const removeFormField = (index: number) => {
        setData({ ...data, formFields: data.formFields.filter((_, i) => i !== index) });
    };

    // --- Document Helpers ---
    const addDocument = () => {
        const newId = data.documents.length > 0 ? Math.max(...data.documents.map(d => d.id)) + 1 : 1;
        setData({ ...data, documents: [...data.documents, { id: newId, name: "New Document", required: false }] });
    };

    const updateDocument = (index: number, field: keyof Document, value: string | boolean) => {
        const newDocs = [...data.documents];
        newDocs[index] = { ...newDocs[index], [field]: value };
        setData({ ...data, documents: newDocs });
    };

    const removeDocument = (index: number) => {
        setData({ ...data, documents: data.documents.filter((_, i) => i !== index) });
    };

    // --- Class Options Helpers ---
    const addClassOption = () => {
        const nextValue = String(data.classOptions.length + 1);
        setData({ ...data, classOptions: [...data.classOptions, { value: nextValue, label: `Class ${nextValue}` }] });
    };

    const updateClassOption = (index: number, field: keyof ClassOption, value: string) => {
        const newOptions = [...data.classOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setData({ ...data, classOptions: newOptions });
    };

    const removeClassOption = (index: number) => {
        setData({ ...data, classOptions: data.classOptions.filter((_, i) => i !== index) });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/editor" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Application Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#7b1fa2] text-white rounded-lg hover:bg-[#6a1b9a] transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>Publish Changes</>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-16">

                        {/* Page Header Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <span className="text-2xl">📄</span> Page Header
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={data.pageTitle}
                                        onChange={(e) => setData({ ...data, pageTitle: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Page Subtitle</label>
                                    <input
                                        type="text"
                                        value={data.pageSubtitle}
                                        onChange={(e) => setData({ ...data, pageSubtitle: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Form Fields Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📝</span> Form Fields
                                </h2>
                                <button onClick={addFormField} className="text-sm px-3 py-1 bg-[#7b1fa2]/10 text-[#7b1fa2] rounded-full font-medium hover:bg-[#7b1fa2]/20 transition-colors">
                                    + Add Field
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.formFields.map((field, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 group">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-500">Field #{field.id}</span>
                                            <button
                                                onClick={() => removeFormField(i)}
                                                className="p-1.5 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove field"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => updateFormField(i, "label", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#7b1fa2] text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Name (key)</label>
                                                <input
                                                    type="text"
                                                    value={field.name}
                                                    onChange={(e) => updateFormField(i, "name", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#7b1fa2] text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Type</label>
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => updateFormField(i, "type", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#7b1fa2] text-sm"
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="email">Email</option>
                                                    <option value="phone">Phone</option>
                                                    <option value="select">Select (Dropdown)</option>
                                                    <option value="textarea">Textarea</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                                                <input
                                                    type="text"
                                                    value={field.placeholder}
                                                    onChange={(e) => updateFormField(i, "placeholder", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#7b1fa2] text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) => updateFormField(i, "required", e.target.checked)}
                                                    className="w-4 h-4 text-[#7b1fa2] border-gray-300 rounded focus:ring-[#7b1fa2]"
                                                />
                                                <span className="text-sm text-gray-600">Required field</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Submit Button Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <span className="text-2xl">🔘</span> Submit Button
                            </h2>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={data.submitButtonText}
                                    onChange={(e) => setData({ ...data, submitButtonText: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                />
                            </div>
                        </section>

                        {/* Documents Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📋</span> Required Documents
                                </h2>
                                <button onClick={addDocument} className="text-sm px-3 py-1 bg-[#7b1fa2]/10 text-[#7b1fa2] rounded-full font-medium hover:bg-[#7b1fa2]/20 transition-colors">
                                    + Add Document
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.documents.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 group">
                                        <input
                                            type="text"
                                            value={doc.name}
                                            onChange={(e) => updateDocument(i, "name", e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all"
                                        />
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={doc.required}
                                                onChange={(e) => updateDocument(i, "required", e.target.checked)}
                                                className="w-4 h-4 text-[#7b1fa2] border-gray-300 rounded focus:ring-[#7b1fa2]"
                                            />
                                            <span className="text-sm text-gray-600">Required</span>
                                        </label>
                                        <button
                                            onClick={() => removeDocument(i)}
                                            className="p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove document"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Class Options Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">🎓</span> Class Options
                                </h2>
                                <button onClick={addClassOption} className="text-sm px-3 py-1 bg-[#7b1fa2]/10 text-[#7b1fa2] rounded-full font-medium hover:bg-[#7b1fa2]/20 transition-colors">
                                    + Add Class
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.classOptions.map((option, i) => (
                                    <div key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7b1fa2]/10 border border-[#7b1fa2]/20 rounded-full group">
                                        <input
                                            type="text"
                                            value={option.label}
                                            onChange={(e) => updateClassOption(i, "label", e.target.value)}
                                            className="bg-transparent border-none outline-none text-sm text-[#7b1fa2] font-medium w-auto min-w-[60px]"
                                            style={{ width: `${Math.max(60, option.label.length * 8)}px` }}
                                        />
                                        <button
                                            onClick={() => removeClassOption(i)}
                                            className="p-0.5 text-red-400 hover:text-red-600 transition-colors"
                                            title="Remove class"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Messages Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <span className="text-2xl">💬</span> Messages
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Important Note</label>
                                    <textarea
                                        value={data.importantNote}
                                        onChange={(e) => setData({ ...data, importantNote: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Success Message (after form submission)</label>
                                    <textarea
                                        value={data.successMessage}
                                        onChange={(e) => setData({ ...data, successMessage: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Preview Panel */}
                <AnimatePresence mode="wait">
                    {showPreview && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "50%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="border-l border-gray-200 bg-gray-50 flex flex-col relative"
                        >
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsPreviewFullscreen(true)}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Fullscreen"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
                                <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                    <iframe
                                        ref={iframeRef}
                                        src="/preview/application"
                                        className="w-full h-full border-0"
                                        title="Application Preview"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fullscreen Preview Modal */}
            <AnimatePresence>
                {isPreviewFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm"
                    >
                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                            <button
                                onClick={() => setIsPreviewFullscreen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <iframe
                                ref={fullscreenIframeRef}
                                src="/preview/application"
                                className="w-full h-full border-0"
                                title="Fullscreen Application Preview"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
