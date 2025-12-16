"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Types ---
interface AdmissionStep {
    step: number;
    title: string;
    desc: string;
}

interface Fee {
    class: string;
    admission: string;
    tuition: string;
}

interface AdmissionsData {
    process: AdmissionStep[];
    documents: string[];
    feeStructure: Fee[];
    feeNote: string;
}

const defaultData: AdmissionsData = {
    process: [
        { step: 1, title: "Enquiry", desc: "Visit school or fill online enquiry form" }
    ],
    documents: [
        "Birth Certificate"
    ],
    feeStructure: [
        { class: "Class 1-5", admission: "₹15,000", tuition: "₹3,500/month" }
    ],
    feeNote: "* Additional charges for transport, books, and uniform apply."
};

export default function AdmissionsEditorPage() {
    const [data, setData] = useState<AdmissionsData>(defaultData);
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
                // API returns: { process: { steps: [...] }, requirements: { documents: [...] }, fees: { structure: [...] } }
                const processData = content.process || {};
                const requirementsData = content.requirements || {};
                const feesData = content.fees || {};

                // Extract arrays from nested structure
                const steps = Array.isArray(processData) ? processData : (processData.steps || []);
                const docs = Array.isArray(requirementsData) ? requirementsData : (requirementsData.documents || []);
                const fees = Array.isArray(feesData) ? feesData : (feesData.structure || []);

                const loadedData: AdmissionsData = {
                    process: steps.length > 0 ? steps : defaultData.process,
                    documents: docs.length > 0 ? docs : defaultData.documents,
                    feeStructure: fees.length > 0 ? fees : defaultData.feeStructure,
                    feeNote: feesData.note || defaultData.feeNote
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
            const message = { type: "ADMISSIONS_PREVIEW_UPDATE", data };
            iframeRef.current?.contentWindow?.postMessage(message, "*");
            fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
        };
        sendPreviewData();
    }, [data]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_ADMISSIONS_DATA") {
                const message = { type: "ADMISSIONS_PREVIEW_UPDATE", data };
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
            // Save in the same format as the database structure
            const res = await fetch(`${apiUrl}/api/pages/admissions/batch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sections: {
                        process: { steps: data.process },
                        requirements: { documents: data.documents },
                        fees: { structure: data.feeStructure, note: data.feeNote }
                    }
                }),
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

    // --- Helpers ---
    const updateProcess = (index: number, field: keyof AdmissionStep, value: string | number) => {
        const newProcess = [...data.process];
        newProcess[index] = { ...newProcess[index], [field]: value };
        setData({ ...data, process: newProcess });
    };

    const addProcessStep = () => {
        setData({
            ...data,
            process: [...data.process, { step: data.process.length + 1, title: "New Step", desc: "" }]
        });
    };

    const removeProcessStep = (index: number) => {
        // Re-calculate step numbers
        const newProcess = data.process.filter((_, i) => i !== index).map((step, i) => ({ ...step, step: i + 1 }));
        setData({ ...data, process: newProcess });
    };

    const updateDocument = (index: number, value: string) => {
        const newDocs = [...data.documents];
        newDocs[index] = value;
        setData({ ...data, documents: newDocs });
    };

    const addDocument = () => {
        setData({ ...data, documents: [...data.documents, "New Document"] });
    };

    const removeDocument = (index: number) => {
        setData({ ...data, documents: data.documents.filter((_, i) => i !== index) });
    };

    const updateFee = (index: number, field: keyof Fee, value: string) => {
        const newFees = [...data.feeStructure];
        newFees[index] = { ...newFees[index], [field]: value };
        setData({ ...data, feeStructure: newFees });
    };

    const addFee = () => {
        setData({ ...data, feeStructure: [...data.feeStructure, { class: "New Class", admission: "₹0", tuition: "₹0/month" }] });
    };

    const removeFee = (index: number) => {
        setData({ ...data, feeStructure: data.feeStructure.filter((_, i) => i !== index) });
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
                    <h1 className="text-xl font-bold text-gray-800">Admissions Editor</h1>
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
                        className="px-6 py-2 bg-[#43a047] text-white rounded-lg hover:bg-[#388e3c] transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
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

                        {/* Process Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📋</span> Admission Process
                                </h2>
                                <button onClick={addProcessStep} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Step
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.process.map((step, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group flex gap-4">
                                        <button
                                            onClick={() => removeProcessStep(i)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">
                                            {step.step}
                                        </div>

                                        <div className="flex-1">
                                            <div className="mb-3">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={step.title}
                                                    onChange={(e) => updateProcess(i, "title", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    value={step.desc}
                                                    onChange={(e) => updateProcess(i, "desc", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Documents Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📄</span> Required Documents
                                </h2>
                                <button onClick={addDocument} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Document
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.documents.map((doc, i) => (
                                    <div key={i} className="flex gap-2 relative group">
                                        <input
                                            type="text"
                                            value={doc}
                                            onChange={(e) => updateDocument(i, e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                        />
                                        <button
                                            onClick={() => removeDocument(i)}
                                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
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

                        {/* Fees Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">💰</span> Fee Structure
                                </h2>
                                <button onClick={addFee} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Row
                                </button>
                            </div>
                            <div className="space-y-4">
                                {data.feeStructure.map((fee, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group grid md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => removeFee(i)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Class</label>
                                            <input
                                                type="text"
                                                value={fee.class}
                                                onChange={(e) => updateFee(i, "class", e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admission Fee</label>
                                            <input
                                                type="text"
                                                value={fee.admission}
                                                onChange={(e) => updateFee(i, "admission", e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tuition Fee</label>
                                            <input
                                                type="text"
                                                value={fee.tuition}
                                                onChange={(e) => updateFee(i, "tuition", e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Fee Note Section */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Note</label>
                                <input
                                    type="text"
                                    value={data.feeNote || ""}
                                    onChange={(e) => setData({ ...data, feeNote: e.target.value })}
                                    placeholder="e.g., * Additional charges for transport, books, and uniform apply."
                                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all text-sm"
                                />
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
                                        src="/preview/admissions"
                                        className="w-full h-full border-0"
                                        title="Admissions Preview"
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
                                src="/preview/admissions"
                                className="w-full h-full border-0"
                                title="Fullscreen Admissions Preview"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
