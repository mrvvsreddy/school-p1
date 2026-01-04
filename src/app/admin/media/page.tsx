"use client";

import React from "react";
import ImageManager from "@/school-admin/components/ImageManager";

export default function MediaPage() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-[#1A1A1A]">Media Library</h1>
                    <p className="text-xs text-gray-500">Manage images and videos from your storage</p>
                </div>
            </div>

            {/* Full-width Media Manager */}
            <ImageManager />
        </div>
    );
}
