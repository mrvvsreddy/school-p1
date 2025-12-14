"use client";

import React from "react";
import { SiteContent, HeroSlide } from "@/data/types";

interface HeroEditorProps {
    content: SiteContent;
    onUpdate: (newContent: SiteContent) => void;
}

export default function HeroEditor({ content, onUpdate }: HeroEditorProps) {
    const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
        const newSlides = [...content.hero.slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        onUpdate({
            ...content,
            hero: { ...content.hero, slides: newSlides }
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#C4A35A] rounded-full"></span>
                    Hero Slides
                </h2>
                <span className="text-sm text-gray-400">Manage the main homepage sliders</span>
            </div>

            <div className="grid gap-6">
                {content.hero.slides.map((slide, index) => (
                    <div key={slide.id} className="group relative p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#C4A35A]/30 transition-colors">
                        <div className="absolute top-4 right-4 text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border">
                            Slide #{index + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 lg:col-span-3">
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Preview Image</label>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 border border-gray-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={slide.image}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'; }}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Image Path</label>
                                    <input
                                        type="text"
                                        value={slide.image}
                                        onChange={(e) => updateSlide(index, "image", e.target.value)}
                                        className="w-full text-sm p-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-8 lg:col-span-9 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => updateSlide(index, "title", e.target.value)}
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all font-medium text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Subtitle</label>
                                    <textarea
                                        value={slide.subtitle}
                                        onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                                        rows={3}
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/20 focus:border-[#C4A35A] outline-none transition-all text-gray-600 leading-relaxed resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
