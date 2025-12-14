"use client";

import React from "react";
import { upcomingExams } from "@/school-admin/data/mockData";

export default function ExamPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Examinations</h1>
                    <p className="text-gray-500 mt-1">Manage exams and results</p>
                </div>
                <button className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors">
                    + Schedule Exam
                </button>
            </div>

            {/* Upcoming Exams */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#333]">Upcoming Examinations</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {upcomingExams.map((exam) => (
                        <div key={exam.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#C4A35A]/10 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#333]">{exam.subject}</h4>
                                    <p className="text-sm text-gray-500">Class {exam.class}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-[#333]">{exam.date}</p>
                                <p className="text-sm text-gray-500">{exam.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
