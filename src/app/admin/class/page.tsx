"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getClasses, deleteClass, Class } from "@/school-admin/services/classService";
import ClassDetailModal from "@/school-admin/components/ClassDetailModal";
import AddClassModal from "@/school-admin/components/AddClassModal";

export default function ClassesPage() {
    // State
    const [classList, setClassList] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalClasses, setTotalClasses] = useState(0);

    // Fetch classes from API
    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: { search?: string } = {};
            if (searchQuery) filters.search = searchQuery;

            const response = await getClasses(filters);
            setClassList(response.classes);
            setTotalClasses(response.total);
        } catch (err) {
            console.error("Error fetching classes:", err);
            setError(err instanceof Error ? err.message : "Failed to load classes");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    // Handle class added
    const handleClassAdded = () => {
        setIsAddModalOpen(false);
        fetchClasses();
    };

    // Handle class updated
    const handleClassUpdated = () => {
        setSelectedClass(null);
        fetchClasses();
    };

    // Handle delete
    const handleDeleteClass = async (classId: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            await deleteClass(classId);
            fetchClasses();
            setSelectedClass(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete class");
        }
    };

    // Compute total students
    const totalStudents = classList.reduce((sum, cls) => sum + (cls.students_count || 0), 0);
    const totalCapacity = classList.reduce((sum, cls) => sum + (cls.capacity || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Classes</h1>
                    <p className="text-gray-500 mt-1">Manage classes, sections, and timetables</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Class
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Classes</p>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{totalClasses}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{totalStudents}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Capacity</p>
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{totalCapacity}</p>
                </div>
            </div>

            {/* List View Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[#333]">All Classes</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search class or room..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-[#C4A35A] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Loading classes...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-500">{error}</p>
                        <button onClick={fetchClasses} className="mt-4 text-[#C4A35A] hover:underline">
                            Try again
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Teacher</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {classList.length > 0 ? (
                                classList.map((cls) => (
                                    <tr
                                        key={cls.id}
                                        onClick={() => setSelectedClass(cls)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#C4A35A]/10 flex items-center justify-center text-[#C4A35A] font-bold text-sm">
                                                    {cls.class}-{cls.section}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Class {cls.class}</p>
                                                    <p className="text-xs text-gray-500">Section {cls.section}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {cls.class_teacher_name || "Not Assigned"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="font-semibold text-gray-900">{cls.students_count || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {cls.room || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No classes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {selectedClass && (
                <ClassDetailModal
                    classData={selectedClass}
                    onClose={() => setSelectedClass(null)}
                    onEdit={handleClassUpdated}
                    onDelete={() => handleDeleteClass(selectedClass.id)}
                />
            )}

            {isAddModalOpen && (
                <AddClassModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleClassAdded}
                />
            )}
        </div>
    );
}
