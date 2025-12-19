"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteContent } from "@/data/types";
import HeroEditor from "./components/HeroEditor";
import WelcomeEditor from "./components/WelcomeEditor";
import FacilitiesEditor from "./components/FacilitiesEditor";
import AboutEditor from "./components/AboutEditor";
import AcademicsEditor from "./components/AcademicsEditor";

export default function ContentEditor() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");

    useEffect(() => {
        fetch("/api/content", { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setContent(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
                credentials: 'include'
            });
            if (res.ok) {
                alert("Saved successfully!");
            } else {
                alert("Error saving");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = (newContent: SiteContent) => {
        setContent(newContent);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading content...</div>;

    const sections = [
        { id: "hero", label: "Hero Banner", icon: "🖼️" },
        { id: "welcome", label: "Welcome Section", icon: "👋" },
        { id: "facilities", label: "Facilities", icon: "🏢" },
        { id: "about", label: "About Page", icon: "📖" },
        { id: "academics", label: "Academics", icon: "🎓" },
    ];

    return (
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
            {/* Sidebar Navigation for Editor */}
            <div className="w-64 flex-shrink-0 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Sections</h2>
                    <p className="text-xs text-gray-400">Select a section to edit</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === section.id
                                ? "bg-[#C4A35A]/10 text-[#C4A35A]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <span className="text-lg">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full px-4 py-2 bg-[#C4A35A] text-white font-medium rounded-lg hover:bg-[#b0924e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#C4A35A]/20"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "hero" && content && (
                            <HeroEditor content={content} onUpdate={handleUpdate} />
                        )}
                        {activeTab === "welcome" && content && (
                            <WelcomeEditor content={content} onUpdate={handleUpdate} />
                        )}
                        {activeTab === "facilities" && content && (
                            <FacilitiesEditor content={content} onUpdate={handleUpdate} />
                        )}
                        {activeTab === "about" && content && (
                            <AboutEditor content={content} onUpdate={handleUpdate} />
                        )}
                        {activeTab === "academics" && content && (
                            <AcademicsEditor content={content} onUpdate={handleUpdate} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
