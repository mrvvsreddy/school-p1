"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface StorageFile {
    id: string;
    name: string;
    path: string;
    url: string;
    size: number;
    mimetype: string;
    created_at: string;
}

type FilterType = "all" | "images" | "videos";

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function isVideo(file: StorageFile): boolean {
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
    const name = file.name.toLowerCase();
    return videoExtensions.some(ext => name.endsWith(ext)) ||
        file.mimetype?.startsWith("video/");
}

function isImage(file: StorageFile): boolean {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico"];
    const name = file.name.toLowerCase();
    return imageExtensions.some(ext => name.endsWith(ext)) ||
        file.mimetype?.startsWith("image/");
}

// Preview Modal Component
function PreviewModal({ file, onClose, onDownload, onDelete, onCopyUrl }: {
    file: StorageFile;
    onClose: () => void;
    onDownload: (file: StorageFile) => void;
    onDelete: (file: StorageFile) => void;
    onCopyUrl: (url: string) => void;
}) {
    const fileIsVideo = isVideo(file);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{file.name}</h3>
                        {fileIsVideo && (
                            <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded flex-shrink-0">VIDEO</span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview Area */}
                <div className="flex items-center justify-center bg-gray-900 min-h-[300px] max-h-[60vh]">
                    {fileIsVideo ? (
                        <video
                            src={file.url}
                            controls
                            autoPlay
                            className="max-w-full max-h-[60vh] object-contain"
                        />
                    ) : (
                        <div className="relative w-full h-[60vh]">
                            <Image
                                src={file.url}
                                alt={file.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50">
                    <div className="text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="mx-2">•</span>
                        <span className="truncate">{file.path}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onCopyUrl(file.url)}
                            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            Copy URL
                        </button>
                        <button
                            onClick={() => onDownload(file)}
                            className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            Download
                        </button>
                        <button
                            onClick={() => { onDelete(file); onClose(); }}
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ImageManager() {
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("all");

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/storage/images`, { credentials: 'include' });
            if (!res.ok) throw new Error("Failed to fetch files");
            const data = await res.json();
            setFiles(data.images || []);
        } catch (err) {
            console.error("Error fetching files:", err);
            setError("Failed to load media files");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const filteredFiles = files.filter(file => {
        if (filter === "images") return isImage(file);
        if (filter === "videos") return isVideo(file);
        return true;
    });

    const counts = {
        all: files.length,
        images: files.filter(isImage).length,
        videos: files.filter(isVideo).length,
    };

    const handleDownload = async (file: StorageFile) => {
        try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            // Fallback: open in new tab
            window.open(file.url, "_blank");
        }
    };

    const handleDelete = async (file: StorageFile) => {
        if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;

        setDeleting(file.path);
        try {
            const res = await fetch(`${API_BASE}/api/storage/images/${encodeURIComponent(file.path)}`, {
                method: "DELETE",
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to delete file");

            setFiles(prev => prev.filter(f => f.path !== file.path));
            if (previewFile?.path === file.path) {
                setPreviewFile(null);
            }
        } catch (err) {
            console.error("Error deleting file:", err);
            alert("Failed to delete file");
        } finally {
            setDeleting(null);
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-800">Media Library</h3>
                    </div>
                    <button
                        onClick={fetchFiles}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 px-3 py-2 border-b border-gray-50">
                    {(["all", "images", "videos"] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${filter === type
                                ? "bg-[#C4A35A] text-white"
                                : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {type === "all" ? "All" : type === "images" ? "Images" : "Videos"}
                            <span className="ml-1 opacity-70">({counts[type]})</span>
                        </button>
                    ))}
                </div>

                {/* Content - Increased height */}
                <div className="p-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin w-6 h-6 border-2 border-[#C4A35A] border-t-transparent rounded-full"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-red-500 mb-2">{error}</p>
                            <button onClick={fetchFiles} className="text-xs text-[#C4A35A] hover:underline cursor-pointer">
                                Retry
                            </button>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">No {filter === "all" ? "files" : filter} found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[500px] overflow-y-auto">
                            {filteredFiles.map((file) => {
                                const fileIsVideo = isVideo(file);
                                return (
                                    <div
                                        key={file.path}
                                        className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#C4A35A] hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => setPreviewFile(file)}
                                    >
                                        {fileIsVideo ? (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                <svg className="w-10 h-10 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <Image
                                                src={file.url}
                                                alt={file.name}
                                                fill
                                                className="object-cover"
                                                sizes="120px"
                                            />
                                        )}
                                        {deleting === file.path && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            </div>
                                        )}
                                        {/* Type indicator */}
                                        {fileIsVideo && (
                                            <div className="absolute top-1 left-1 bg-black/60 rounded px-1.5 py-0.5">
                                                <span className="text-[9px] text-white font-medium">VIDEO</span>
                                            </div>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                                                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors cursor-pointer"
                                                    title="Download"
                                                >
                                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                                    className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        {/* File name on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-white truncate">{file.name}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewFile && (
                <PreviewModal
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onCopyUrl={handleCopyUrl}
                />
            )}
        </>
    );
}
