"use client";

import React from "react";
import { SiteContent, WelcomeStat } from "@/data/types";

interface WelcomeEditorProps {
    content: SiteContent;
    onUpdate: (newContent: SiteContent) => void;
}

export default function WelcomeEditor({ content, onUpdate }: WelcomeEditorProps) {
    const data = content.welcome;

    // In case data is missing (initial migration)
    if (!data) return <div>No Welcome Data Found</div>;

    const updateField = (field: string, value: string) => {
        onUpdate({
            ...content,
            welcome: { ...data, [field]: value }
        });
    };

    const updateStat = (index: number, field: keyof WelcomeStat, value: string) => {
        const newStats = [...data.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        onUpdate({
            ...content,
            welcome: { ...data, stats: newStats }
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#C4A35A] rounded-full"></span>
                    Welcome Section
                </h2>
                <span className="text-sm text-gray-400">Manage the welcome message and stats</span>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Main Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all font-medium text-lg"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Intro Paragraph 1</label>
                        <textarea
                            value={data.intro1}
                            onChange={(e) => updateField("intro1", e.target.value)}
                            rows={4}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all text-gray-600 leading-relaxed resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Intro Paragraph 2</label>
                        <textarea
                            value={data.intro2}
                            onChange={(e) => updateField("intro2", e.target.value)}
                            rows={4}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all text-gray-600 leading-relaxed resize-none"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Number</label>
                                <input
                                    type="text"
                                    value={stat.number}
                                    onChange={(e) => updateStat(index, "number", e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:border-[#C4A35A] outline-none font-bold text-[#C4A35A]"
                                />
                            </div>
                            <div className="mt-3">
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => updateStat(index, "label", e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded focus:border-[#C4A35A] outline-none text-sm text-gray-600"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
