"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MediaUpload from "@/editor/components/MediaUpload";

// --- Types ---
interface Grade {
    title: string;
    classes: string;
    age: string;
    description: string;
    image: string;
    features: string[];
}

interface Methodology {
    name: string;
    icon: string;
}

interface CalendarField {
    label: string;
    value: string;
}

interface CalendarTerm {
    title: string;
    fields: CalendarField[];
}

interface AcademicsData {
    grades: Grade[];
    methodologies: Methodology[];
    calendar: CalendarTerm[];
}

const defaultData: AcademicsData = {
    grades: [
        {
            title: "Primary Wing",
            classes: "Class 1-5",
            age: "6-10 Years",
            description: "Building a strong foundation through activity-based learning.",
            image: "",
            features: ["Phonics"]
        }
    ],
    methodologies: [
        { name: "Experiential Learning", icon: "🧠" }
    ],
    calendar: [
        {
            title: "Term 1",
            fields: [
                { label: "Duration", value: "April - September" },
                { label: "Examinations", value: "September" }
            ]
        }
    ]
};

export default function AcademicsEditorPage() {
    const [data, setData] = useState<AcademicsData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

    // Upload state removed - using MediaUpload component

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    // Initial load
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/api/pages/academics`)
            .then((res) => res.json())
            .then((content) => {
                if (content.academics) {
                    // Migrate old calendar format to new format
                    const loadedData = content.academics;
                    if (loadedData.calendar) {
                        loadedData.calendar = loadedData.calendar.map((term: { term?: string; dates?: string; exams?: string; title?: string; fields?: { label: string; value: string }[] }) => {
                            // If already new format, keep as is
                            if (term.fields) return term;
                            // Convert old format to new format
                            return {
                                title: term.term || term.title || "Term",
                                fields: [
                                    { label: "Duration", value: term.dates || "" },
                                    { label: "Examinations", value: term.exams || "" }
                                ].filter(f => f.value) // Only keep fields with values
                            };
                        });
                    }
                    setData(loadedData);
                }
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
            const message = { type: "ACADEMICS_PREVIEW_UPDATE", data };
            iframeRef.current?.contentWindow?.postMessage(message, "*");
            fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
        };
        sendPreviewData();
    }, [data]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_ACADEMICS_DATA") {
                const message = { type: "ACADEMICS_PREVIEW_UPDATE", data };
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
            const res = await fetch(`${apiUrl}/api/pages/academics/batch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: { academics: data } }),
                credentials: 'include'
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



    // --- Helpers for Arrays ---

    const updateGrade = (index: number, field: keyof Grade, value: string | string[]) => {
        const newGrades = [...data.grades];
        newGrades[index] = { ...newGrades[index], [field]: value };
        setData({ ...data, grades: newGrades });
    };

    const addGrade = () => {
        setData({
            ...data,
            grades: [...data.grades, { title: "New Grade", classes: "", age: "", description: "", image: "", features: [] }]
        });
    };

    const removeGrade = (index: number) => {
        const newGrades = data.grades.filter((_, i) => i !== index);
        setData({ ...data, grades: newGrades });
    };



    const addGradeFeature = (gradeIndex: number) => {
        const newGrades = [...data.grades];
        newGrades[gradeIndex].features = [...(newGrades[gradeIndex].features || []), "New Subject"];
        setData({ ...data, grades: newGrades });
    };

    const updateSingleFeature = (gradeIndex: number, featureIndex: number, value: string) => {
        const newGrades = [...data.grades];
        newGrades[gradeIndex].features[featureIndex] = value;
        setData({ ...data, grades: newGrades });
    };

    const removeGradeFeature = (gradeIndex: number, featureIndex: number) => {
        const newGrades = [...data.grades];
        newGrades[gradeIndex].features = newGrades[gradeIndex].features.filter((_, i) => i !== featureIndex);
        setData({ ...data, grades: newGrades });
    };

    const updateMethodology = (index: number, field: keyof Methodology, value: string) => {
        const newMethods = [...data.methodologies];
        newMethods[index] = { ...newMethods[index], [field]: value };
        setData({ ...data, methodologies: newMethods });
    };

    const addMethodology = () => {
        setData({ ...data, methodologies: [...data.methodologies, { name: "New Method", icon: "💡" }] });
    };

    const removeMethodology = (index: number) => {
        setData({ ...data, methodologies: data.methodologies.filter((_, i) => i !== index) });
    };

    const updateCalendarTitle = (index: number, title: string) => {
        const newCal = [...data.calendar];
        newCal[index] = { ...newCal[index], title };
        setData({ ...data, calendar: newCal });
    };

    const updateCalendarField = (termIndex: number, fieldIndex: number, key: 'label' | 'value', value: string) => {
        const newCal = [...data.calendar];
        newCal[termIndex].fields[fieldIndex] = { ...newCal[termIndex].fields[fieldIndex], [key]: value };
        setData({ ...data, calendar: newCal });
    };

    const addCalendarField = (termIndex: number) => {
        const newCal = [...data.calendar];
        newCal[termIndex].fields = [...newCal[termIndex].fields, { label: "New Field", value: "" }];
        setData({ ...data, calendar: newCal });
    };

    const removeCalendarField = (termIndex: number, fieldIndex: number) => {
        const newCal = [...data.calendar];
        newCal[termIndex].fields = newCal[termIndex].fields.filter((_, i) => i !== fieldIndex);
        setData({ ...data, calendar: newCal });
    };

    const addCalendarTerm = () => {
        setData({
            ...data,
            calendar: [...data.calendar, {
                title: "New Term",
                fields: [
                    { label: "Duration", value: "" },
                    { label: "Examinations", value: "" }
                ]
            }]
        });
    };

    const removeCalendarTerm = (index: number) => {
        setData({ ...data, calendar: data.calendar.filter((_, i) => i !== index) });
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
                    <h1 className="text-xl font-bold text-gray-800">Academics Editor</h1>
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

                        {/* Grades Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">🎓</span> Academic Programs
                                </h2>
                                <button onClick={addGrade} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Program
                                </button>
                            </div>
                            <div className="space-y-6">
                                {data.grades.map((grade, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button
                                            onClick={() => removeGrade(i)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={grade.title}
                                                    onChange={(e) => updateGrade(i, "title", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Classes</label>
                                                <input
                                                    type="text"
                                                    value={grade.classes}
                                                    onChange={(e) => updateGrade(i, "classes", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                            <textarea
                                                value={grade.description}
                                                onChange={(e) => updateGrade(i, "description", e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Core Subjects</label>
                                                <button onClick={() => addGradeFeature(i)} className="text-xs px-2 py-1 bg-[#43a047]/10 text-[#43a047] rounded font-medium hover:bg-[#43a047]/20 transition-colors">
                                                    + Add Subject
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(grade.features || []).map((feature, fi) => (
                                                    <div key={fi} className="flex items-center gap-1 bg-[#43a047]/10 rounded-full pl-3 pr-1 py-1">
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => updateSingleFeature(i, fi, e.target.value)}
                                                            className="bg-transparent text-sm text-[#43a047] font-medium outline-none w-24 min-w-0"
                                                        />
                                                        <button onClick={() => removeGradeFeature(i, fi)} className="p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!grade.features || grade.features.length === 0) && (
                                                    <span className="text-gray-400 text-sm italic">No subjects added yet</span>
                                                )}
                                            </div>
                                        </div>

                                        <MediaUpload
                                            value={grade.image}
                                            onChange={(url) => updateGrade(i, "image", url)}
                                            label="Image / Video"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Methodologies Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">🧠</span> Teaching Methodology
                                </h2>
                                <button onClick={addMethodology} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Item
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.methodologies.map((method, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 group relative">
                                        <button
                                            onClick={() => removeMethodology(i)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="w-12">
                                            <input
                                                type="text"
                                                value={method.icon}
                                                onChange={(e) => updateMethodology(i, "icon", e.target.value)}
                                                className="w-full text-center text-2xl bg-transparent focus:bg-white rounded p-1 outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={method.name}
                                                onChange={(e) => updateMethodology(i, "name", e.target.value)}
                                                className="w-full font-medium bg-transparent focus:bg-white rounded px-2 py-1 outline-none border border-transparent focus:border-gray-200"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Calendar Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📅</span> Academic Calendar
                                </h2>
                                <button onClick={addCalendarTerm} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Term
                                </button>
                            </div>
                            <div className="space-y-6">
                                {data.calendar.map((term, i) => (
                                    <div key={i} className="p-5 bg-gradient-to-br from-[#43a047]/5 to-[#C4A35A]/5 rounded-xl border border-[#43a047]/20 relative group">
                                        <button
                                            onClick={() => removeCalendarTerm(i)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        {/* Term Title */}
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-[#43a047] uppercase tracking-wider mb-1">Term Title</label>
                                            <input
                                                type="text"
                                                value={term.title}
                                                onChange={(e) => updateCalendarTitle(i, e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-[#43a047]/30 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all font-semibold text-lg"
                                                placeholder="e.g. Term 1, First Semester"
                                            />
                                        </div>

                                        {/* Dynamic Fields */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Fields</label>
                                                <button
                                                    onClick={() => addCalendarField(i)}
                                                    className="text-xs px-2 py-1 bg-[#C4A35A]/10 text-[#C4A35A] rounded font-medium hover:bg-[#C4A35A]/20 transition-colors"
                                                >
                                                    + Add Field
                                                </button>
                                            </div>
                                            {(term.fields || []).map((field, fi) => (
                                                <div key={fi} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateCalendarField(i, fi, 'label', e.target.value)}
                                                        className="w-32 px-2 py-1 bg-[#43a047]/5 rounded border-0 text-sm font-semibold text-[#43a047] outline-none"
                                                        placeholder="Label"
                                                    />
                                                    <span className="text-gray-400">:</span>
                                                    <input
                                                        type="text"
                                                        value={field.value}
                                                        onChange={(e) => updateCalendarField(i, fi, 'value', e.target.value)}
                                                        className="flex-1 px-2 py-1 bg-transparent rounded border-0 text-sm text-gray-700 outline-none"
                                                        placeholder="Value"
                                                    />
                                                    <button
                                                        onClick={() => removeCalendarField(i, fi)}
                                                        className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {term.fields.length === 0 && (
                                                <p className="text-gray-400 text-sm italic text-center py-2">No fields added. Click &quot;+ Add Field&quot; to add custom details.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                        src="/preview/academics"
                                        className="w-full h-full border-0"
                                        title="Academics Preview"
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
                                src="/preview/academics"
                                className="w-full h-full border-0"
                                title="Fullscreen Academics Preview"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
