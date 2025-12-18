"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MediaViewProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

function isVideo(url: string): boolean {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
    const name = url.toLowerCase();
    return videoExtensions.some(ext => name.includes(ext)) || url.includes("video");
}

export default function MediaView({ src, alt, className = "", containerClassName = "" }: MediaViewProps) {
    const [showModal, setShowModal] = useState(false);
    const isVideoFile = isVideo(src);

    if (!src) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${containerClassName}`}>
                <span className="text-gray-400 text-sm">No media</span>
            </div>
        );
    }

    return (
        <>
            {/* Thumbnail with hover zoom button */}
            <div className={`relative group cursor-pointer ${containerClassName}`} onClick={() => setShowModal(true)}>
                {isVideoFile ? (
                    <video
                        src={src}
                        className={`w-full h-full object-cover ${className}`}
                        muted
                    />
                ) : (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className={`object-cover ${className}`}
                    />
                )}

                {/* Video indicator */}
                {isVideoFile && (
                    <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1 z-10">
                        <span className="text-xs text-white font-medium">VIDEO</span>
                    </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                    <div className="p-3 bg-white/90 rounded-full shadow-lg">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90" />

                    {/* Close button */}
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Media content */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isVideoFile ? (
                            <video
                                src={src}
                                controls
                                autoPlay
                                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="relative">
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                                    style={{ maxHeight: '90vh', width: 'auto' }}
                                />
                            </div>
                        )}

                        {/* Caption */}
                        <p className="text-center text-white/80 mt-3 text-sm">{alt}</p>
                    </div>
                </div>
            )}
        </>
    );
}
