"use client";

import React, { useState, useEffect } from "react";

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

interface NewExamData {
    subject: string;
    grade: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    location: string;
    color: string;
}

interface AddExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (exam: NewExamData) => void;
    editExam?: Exam | null;
    onUpdate?: (exam: Exam) => void;
}

const gradeOptions = [
    "Grade 9-A", "Grade 9-B", "Grade 9-C",
    "Grade 10-A", "Grade 10-B", "Grade 10-C",
    "Grade 11-A", "Grade 11-B", "Grade 11-C",
    "Grade 12-A", "Grade 12-B", "Grade 12-C"
];

const colorOptions = [
    { label: "Blue", value: "#3B82F6" },
    { label: "Teal", value: "#14B8A6" },
    { label: "Purple", value: "#8B5CF6" },
    { label: "Red", value: "#EF4444" },
    { label: "Green", value: "#22C55E" },
    { label: "Orange", value: "#F97316" },
];

const academicYears = ["2024-2025", "2023-2024", "2022-2023"];

export default function AddExamModal({ isOpen, onClose, onAdd, editExam, onUpdate }: AddExamModalProps) {
    const isEditMode = !!editExam;

    const [formData, setFormData] = useState({
        subject: "",
        grade: "Grade 10-A",
        academicYear: "2024-2025",
        date: "",
        startTime: "",
        endTime: "",
        duration: "",
        location: "",
        color: "#3B82F6",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

    useEffect(() => {

        if (isOpen) {
            if (editExam) {
                // Parse API format to form format
                setFormData({ // eslint-disable-line react-hooks/set-state-in-effect
                    subject: editExam.subject || "",
                    grade: editExam.grade || "Grade 10-A",
                    academicYear: editExam.academic_year || "2024-2025",
                    date: editExam.exam_date || "", // Already YYYY-MM-DD from API
                    startTime: editExam.start_time?.slice(0, 5) || "", // HH:MM from HH:MM:SS
                    endTime: editExam.end_time?.slice(0, 5) || "",
                    duration: editExam.duration || "",
                    location: editExam.location || "",
                    color: editExam.color || "#3B82F6",
                });
            } else {
                setFormData({
                    subject: "",
                    grade: "Grade 10-A",
                    academicYear: "2024-2025",
                    date: "",
                    startTime: "",
                    endTime: "",
                    duration: "",
                    location: "",
                    color: "#3B82F6",
                });
            }
            setErrors({});
        }
    }, [isOpen, editExam]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const calculateDuration = (start: string, end: string) => {
        if (!start || !end) return "";
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
        if (diffMins <= 0) return "";
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
        return `${hours}h ${mins}m`;
    };

    const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
        const newData = { ...formData, [field]: value };
        newData.duration = calculateDuration(
            field === "startTime" ? value : formData.startTime,
            field === "endTime" ? value : formData.endTime
        );
        setFormData(newData);
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        if (!formData.subject.trim()) newErrors.subject = "Required";
        if (!formData.date) newErrors.date = "Required";
        if (!formData.startTime) newErrors.startTime = "Required";
        if (!formData.endTime) newErrors.endTime = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditMode && editExam && onUpdate) {
            // Update existing exam - convert to API format
            onUpdate({
                ...editExam,
                subject: formData.subject,
                grade: formData.grade,
                academic_year: formData.academicYear,
                exam_date: formData.date,
                start_time: formData.startTime,
                end_time: formData.endTime,
                duration: formData.duration,
                location: formData.location,
                color: formData.color,
            });
        } else {
            // Add new exam
            onAdd({
                subject: formData.subject,
                grade: formData.grade,
                academicYear: formData.academicYear,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                duration: formData.duration,
                location: formData.location,
                color: formData.color,
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity cursor-pointer" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div>
                            <h2 className="text-base font-bold text-[#1A1A1A]">
                                {isEditMode ? "Edit Exam" : "Schedule New Exam"}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {isEditMode ? "Update exam details" : "Create a new examination"}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-4 py-3 space-y-3">
                        {/* Subject */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                placeholder="e.g., Mathematics Mid-Term"
                                className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] focus:border-[#C4A35A] ${errors.subject ? "border-red-500" : "border-gray-200"}`}
                            />
                            {errors.subject && <p className="text-red-500 text-[10px] mt-0.5">{errors.subject}</p>}
                        </div>

                        {/* Grade and Year */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Class *</label>
                                <select
                                    value={formData.grade}
                                    onChange={(e) => handleChange("grade", e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] bg-white cursor-pointer"
                                >
                                    {gradeOptions.map((grade) => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Year *</label>
                                <select
                                    value={formData.academicYear}
                                    onChange={(e) => handleChange("academicYear", e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] bg-white cursor-pointer"
                                >
                                    {academicYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date - Native date picker */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                                className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] cursor-pointer ${errors.date ? "border-red-500" : "border-gray-200"}`}
                            />
                            {errors.date && <p className="text-red-500 text-[10px] mt-0.5">{errors.date}</p>}
                        </div>

                        {/* Time Row */}
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start *</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleTimeChange("startTime", e.target.value)}
                                    className={`w-full px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] cursor-pointer ${errors.startTime ? "border-red-500" : "border-gray-200"}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">End *</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleTimeChange("endTime", e.target.value)}
                                    className={`w-full px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] cursor-pointer ${errors.endTime ? "border-red-500" : "border-gray-200"}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    readOnly
                                    placeholder="Auto"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                placeholder="e.g., Main Hall B, Lab 304"
                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A]"
                            />
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
                            <div className="flex gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => handleChange("color", color.value)}
                                        className={`w-7 h-7 rounded-md transition-all cursor-pointer ${formData.color === color.value ? "ring-2 ring-offset-1 ring-[#C4A35A] scale-110" : "hover:scale-105"}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg font-medium hover:bg-[#A38842] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {isEditMode ? "Update" : "Schedule"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
