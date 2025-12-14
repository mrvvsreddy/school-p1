"use client";

import React from "react";
import { notices } from "@/school-admin/data/mockData";

export default function NoticePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Notice Board</h1>
                    <p className="text-gray-500 mt-1">Create and manage school notices</p>
                </div>
                <button className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors">
                    + Create Notice
                </button>
            </div>

            <div className="grid gap-4">
                {notices.map((notice) => (
                    <div key={notice.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-[#333]">{notice.title}</h3>
                                <p className="text-gray-500 text-sm mt-1">{notice.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-sm ${notice.isPinned ? "bg-[#C4A35A] text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                                {notice.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
