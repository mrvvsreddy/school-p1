"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MediaUploadProps {
    value: string; // Current URL (from DB or local preview)
    onChange: (url: string) => void;
    accept?: string; // File types to accept
    label?: string;
}

function isVideo(url: string): boolean {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
    const name = url.toLowerCase();
    return videoExtensions.some(ext => name.includes(ext)) || url.includes("video");
}

export default function MediaUpload({ value, onChange, accept = "image/*,video/*", label = "Media" }: MediaUploadProps) {
    const [localFile, setLocalFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // The display URL is either local preview or the saved value
    const displayUrl = localPreview || value;
    const isVideoFile = localFile?.type.startsWith("video/") || isVideo(displayUrl);
    const hasUnsavedChanges = localPreview !== null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview URL (not uploaded yet)
        const previewUrl = URL.createObjectURL(file);
        setLocalFile(file);
        setLocalPreview(previewUrl);
    };

    const handleUpload = async () => {
        if (!localFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", localFile);

            const res = await fetch(`${API_BASE}/api/editor/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const { url } = await res.json();

            // Update parent with uploaded URL
            onChange(url);

            // Clear local state
            if (localPreview) {
                URL.revokeObjectURL(localPreview);
            }
            setLocalFile(null);
            setLocalPreview(null);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleCancelLocal = () => {
        if (localPreview) {
            URL.revokeObjectURL(localPreview);
        }
        setLocalFile(null);
        setLocalPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        handleCancelLocal();
        onChange("");
    };

    return (
        <>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
                <div className="flex items-start gap-4">
                    {/* Preview Thumbnail */}
                    <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 group border border-gray-200">
                        {displayUrl ? (
                            <>
                                {isVideoFile ? (
                                    <video
                                        src={displayUrl}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                ) : (
                                    <Image
                                        src={displayUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                {/* Hover overlay with zoom button */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}
                                        className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors cursor-pointer shadow-lg"
                                        title="Preview"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Video indicator */}
                                {isVideoFile && (
                                    <div className="absolute top-1 left-1 bg-black/60 rounded px-1.5 py-0.5">
                                        <span className="text-[9px] text-white font-medium">VIDEO</span>
                                    </div>
                                )}
                                {/* Unsaved indicator */}
                                {hasUnsavedChanges && (
                                    <div className="absolute bottom-1 right-1 bg-amber-500 rounded px-1.5 py-0.5">
                                        <span className="text-[8px] text-white font-medium">UNSAVED</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">No media</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept={accept}
                            onChange={handleFileSelect}
                        />

                        {/* Select File Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Choose File
                        </button>

                        {/* Upload Button - only if local file selected */}
                        {hasUnsavedChanges && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="px-3 py-1.5 bg-[#43a047] text-white rounded-lg text-sm font-medium hover:bg-[#388e3c] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Upload
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelLocal}
                                    className="px-2 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition-colors cursor-pointer"
                                    title="Cancel"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Remove - only if has saved value */}
                        {value && !hasUnsavedChanges && (
                            <button
                                onClick={handleRemove}
                                className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                Remove
                            </button>
                        )}

                        {/* File name */}
                        {localFile && (
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{localFile.name}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Preview Modal */}
            {showPreview && displayUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowPreview(false)} />

                    {/* Modal */}
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-gray-800">Preview</h3>
                                {isVideoFile && (
                                    <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">VIDEO</span>
                                )}
                                {hasUnsavedChanges && (
                                    <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">NOT UPLOADED</span>
                                )}
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="flex items-center justify-center bg-gray-900 min-h-[300px] max-h-[70vh]">
                            {isVideoFile ? (
                                <video
                                    src={displayUrl}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[70vh] object-contain"
                                />
                            ) : (
                                <div className="relative w-full h-[70vh]">
                                    <Image
                                        src={displayUrl}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 1024px) 100vw, 1024px"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
