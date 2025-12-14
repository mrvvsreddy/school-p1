"use client";

import React from "react";
import { notices } from "../data/mockData";

export default function NoticeBoard() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-base font-semibold text-[#333]">Notice Board</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Create a notice or find messages for you!</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            {/* Notice List */}
            <div className="space-y-2">
                {notices.map((notice) => (
                    <div
                        key={notice.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C4A35A]/20 to-[#8B7355]/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[#333] truncate">{notice.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate">{notice.description}</p>
                        </div>

                        {/* Date */}
                        <div className={`px-2 py-1 rounded text-[10px] font-medium ${notice.isPinned
                                ? "bg-[#C4A35A] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            {notice.date}
                        </div>

                        <button className="p-0.5 hover:bg-gray-100 rounded cursor-pointer">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
