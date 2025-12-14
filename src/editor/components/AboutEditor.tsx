"use client";

import React from "react";
import { SiteContent, Milestone, Leader, FoundationItem } from "@/data/types";

interface AboutEditorProps {
    content: SiteContent;
    onUpdate: (content: SiteContent) => void;
}

export default function AboutEditor({ content, onUpdate }: AboutEditorProps) {
    const about = content.about;

    const updateAbout = (field: string, value: string | string[] | Milestone[] | Leader[] | FoundationItem[]) => {
        onUpdate({
            ...content,
            about: { ...about, [field]: value },
        });
    };

    const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
        const newMilestones = [...about.milestones];
        newMilestones[index] = { ...newMilestones[index], [field]: value };
        updateAbout("milestones", newMilestones);
    };

    const addMilestone = () => {
        updateAbout("milestones", [...about.milestones, { year: "", event: "" }]);
    };

    const removeMilestone = (index: number) => {
        updateAbout("milestones", about.milestones.filter((_, i) => i !== index));
    };

    const updateFoundation = (index: number, field: keyof FoundationItem, value: string) => {
        const newFoundation = [...about.foundation];
        newFoundation[index] = { ...newFoundation[index], [field]: value };
        updateAbout("foundation", newFoundation);
    };

    const updateLeader = (index: number, field: keyof Leader, value: string) => {
        const newLeadership = [...about.leadership];
        newLeadership[index] = { ...newLeadership[index], [field]: value };
        updateAbout("leadership", newLeadership);
    };

    const addLeader = () => {
        updateAbout("leadership", [...about.leadership, { name: "", role: "", exp: "" }]);
    };

    const removeLeader = (index: number) => {
        updateAbout("leadership", about.leadership.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">About Page</h2>
                <p className="text-gray-500 text-sm">Edit the About Us page content</p>
            </div>

            {/* Story Section */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">📖</span> Our Story
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={about.storyTitle}
                        onChange={(e) => updateAbout("storyTitle", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
                    <textarea
                        value={about.storyIntro1}
                        onChange={(e) => updateAbout("storyIntro1", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
                    <textarea
                        value={about.storyIntro2}
                        onChange={(e) => updateAbout("storyIntro2", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 3</label>
                    <textarea
                        value={about.storyIntro3}
                        onChange={(e) => updateAbout("storyIntro3", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none resize-none"
                    />
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-lg">🏆</span> Key Milestones
                    </h3>
                    <button
                        onClick={addMilestone}
                        className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg hover:bg-[#b0924e] transition-colors"
                    >
                        + Add
                    </button>
                </div>
                <div className="space-y-3">
                    {about.milestones.map((milestone, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={milestone.year}
                                onChange={(e) => updateMilestone(index, "year", e.target.value)}
                                placeholder="Year"
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <input
                                type="text"
                                value={milestone.event}
                                onChange={(e) => updateMilestone(index, "event", e.target.value)}
                                placeholder="Event description"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <button
                                onClick={() => removeMilestone(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Foundation (Mission/Vision/Values) */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">💎</span> Our Foundation
                </h3>
                <div className="space-y-4">
                    {about.foundation.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
                            <div className="flex gap-3 mb-3">
                                <input
                                    type="text"
                                    value={item.icon}
                                    onChange={(e) => updateFoundation(index, "icon", e.target.value)}
                                    placeholder="Icon"
                                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-center text-xl"
                                />
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateFoundation(index, "title", e.target.value)}
                                    placeholder="Title"
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none font-medium"
                                />
                            </div>
                            <textarea
                                value={item.content}
                                onChange={(e) => updateFoundation(index, "content", e.target.value)}
                                rows={2}
                                placeholder="Content"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none resize-none text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Leadership */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-lg">👥</span> Leadership
                    </h3>
                    <button
                        onClick={addLeader}
                        className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg hover:bg-[#b0924e] transition-colors"
                    >
                        + Add
                    </button>
                </div>
                <div className="space-y-3">
                    {about.leadership.map((leader, index) => (
                        <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-gray-100">
                            <input
                                type="text"
                                value={leader.name}
                                onChange={(e) => updateLeader(index, "name", e.target.value)}
                                placeholder="Name"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <input
                                type="text"
                                value={leader.role}
                                onChange={(e) => updateLeader(index, "role", e.target.value)}
                                placeholder="Role"
                                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <input
                                type="text"
                                value={leader.exp}
                                onChange={(e) => updateLeader(index, "exp", e.target.value)}
                                placeholder="Experience"
                                className="w-40 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <button
                                onClick={() => removeLeader(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
