"use client";

import React, { useState, useEffect } from "react";
import { Class, updateClass } from "@/school-admin/services/classService";
import { getTeachers, Teacher } from "@/school-admin/services/teacherService";

interface ClassDetailModalProps {
    classData: Class;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ClassDetailModal({ classData, onClose, onEdit, onDelete }: ClassDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [editForm, setEditForm] = useState({
        room: classData.room || "",
        class_teacher_id: classData.class_teacher_id || "",
        academic_year: classData.academic_year || "2024-25",
    });

    // Fetch teachers for dropdown
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await getTeachers();
                setTeachers(response.teachers);
            } catch (err) {
                console.error("Failed to fetch teachers:", err);
            }
        };
        fetchTeachers();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateClass(classData.id, editForm);
            setIsEditing(false);
            onEdit();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
            setLoading(false);
        }
    };

    if (!classData) return null;

    // Academic year options
    const academicYears = ["2023-24", "2024-25", "2025-26", "2026-27"];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">Class {classData.class} - {classData.section}</h2>
                            {classData.room && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#C4A35A]/10 text-[#C4A35A] text-xs font-semibold border border-[#C4A35A]/20">
                                    Room {classData.room}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Class Teacher: <span className="font-medium text-gray-800">{classData.class_teacher_name || "Not Assigned"}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-[#C4A35A] hover:bg-[#C4A35A]/10 rounded-lg transition-colors cursor-pointer"
                            >
                                Edit
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        {/* Stats */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{classData.students_count || 0}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Students</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{classData.academic_year || "N/A"}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Academic Year</p>
                        </div>

                        {/* Edit Form */}
                        {isEditing && (
                            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Edit Class Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Room</label>
                                        <input
                                            type="text"
                                            value={editForm.room}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Class Teacher</label>
                                        <select
                                            value={editForm.class_teacher_id}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, class_teacher_id: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.employee_id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Academic Year</label>
                                        <select
                                            value={editForm.academic_year}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, academic_year: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            {academicYears.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-4 py-2 text-sm bg-[#C4A35A] text-white rounded-lg hover:bg-[#A38842] disabled:opacity-50 cursor-pointer"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Class Info */}
                        {!isEditing && (
                            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-4">Class Information</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Class</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{classData.class}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Section</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{classData.section}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Room</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{classData.room || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Class Teacher</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{classData.class_teacher_name || "Not Assigned"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-between">
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Delete Class
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
