"use client";

import React from "react";

interface Exam {
    id: string;
    subject: string;
    grade: string;
    academic_year: string;
    exam_date: string;
    start_time: string;
    end_time: string;
    duration: string;
    location: string;
    status: string;
    participants: number;
    color: string;
}

interface ExamDetailModalProps {
    exam: Exam | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (exam: Exam) => void;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case "Scheduled":
            return { bg: "bg-[#C4A35A]/10", text: "text-[#C4A35A]", dot: "bg-[#C4A35A]" };
        case "Draft":
            return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
        case "Completed":
            return { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" };
        default:
            return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

export default function ExamDetailModal({ exam, isOpen, onClose, onEdit }: ExamDetailModalProps) {
    if (!isOpen || !exam) return null;

    const statusStyles = getStatusStyles(exam.status);
    const isCompleted = exam.status === "Completed";

    const handleEdit = () => {
        if (onEdit && exam) {
            onEdit(exam);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity cursor-pointer" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${exam.color}15` }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    style={{ color: exam.color }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#1A1A1A]">{exam.subject}</h2>
                                <p className="text-xs text-gray-500">{exam.grade} • {exam.academic_year}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
                            <span className={statusStyles.text}>{exam.status}</span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="font-medium text-gray-900">{formatDate(exam.exam_date)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Time</p>
                                <p className="font-medium text-gray-900">
                                    {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="font-medium text-gray-900">{exam.duration || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Location</p>
                                <p className="font-medium text-gray-900">{exam.location || "TBD"}</p>
                            </div>
                            {exam.participants > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400">Participants</p>
                                    <p className="font-medium text-gray-900">{exam.participants} students</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                        {!isCompleted && (
                            <button
                                onClick={handleEdit}
                                className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg font-medium hover:bg-[#A38842] transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Exam
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
