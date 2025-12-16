"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getTeachers, deleteTeacher, Teacher } from "@/school-admin/services/teacherService";
import TeacherDetailModal from "@/school-admin/components/TeacherDetailModal";
import AddTeacherModal from "@/school-admin/components/AddTeacherModal";

export default function TeachersPage() {
    // State
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [totalTeachers, setTotalTeachers] = useState(0);

    // Fetch teachers from API
    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: { search?: string } = {};
            if (searchQuery) filters.search = searchQuery;

            const response = await getTeachers(filters);
            setTeachers(response.teachers);
            setTotalTeachers(response.total);
        } catch (err) {
            console.error("Error fetching teachers:", err);
            setError(err instanceof Error ? err.message : "Failed to load teachers");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Handle teacher added
    const handleTeacherAdded = () => {
        setIsAddModalOpen(false);
        fetchTeachers();
    };

    // Handle teacher updated
    const handleTeacherUpdated = () => {
        setSelectedTeacher(null);
        fetchTeachers();
    };

    // Handle teacher delete
    const handleDeleteTeacher = async (teacherId: string) => {
        if (!confirm("Are you sure you want to delete this teacher?")) return;

        try {
            await deleteTeacher(teacherId);
            fetchTeachers();
            setSelectedTeacher(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete teacher");
        }
    };

    // Derived stats
    const activeTeachers = teachers.filter(t => t.status === "Active").length;
    const onLeave = teachers.filter(t => t.status === "On Leave").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Teachers</h1>
                    <p className="text-gray-500 mt-1">Manage all teachers and staff</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Teacher
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Teachers</p>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{totalTeachers}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Active</p>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{activeTeachers}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">On Leave</p>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{onLeave}</p>
                </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-[#333]">All Teachers</h3>

                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search name or subject..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-[#C4A35A] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Loading teachers...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-500">{error}</p>
                        <button onClick={fetchTeachers} className="mt-4 text-[#C4A35A] hover:underline">
                            Try again
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teachers.length > 0 ? (
                                teachers.map((teacher) => (
                                    <tr
                                        key={teacher.id}
                                        onClick={() => setSelectedTeacher(teacher)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {teacher.photo_url ? (
                                                    <img
                                                        src={teacher.photo_url}
                                                        alt={teacher.name}
                                                        className="w-9 h-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B7355] to-[#C4A35A] flex items-center justify-center text-white font-medium text-sm">
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm text-[#333]">{teacher.name}</p>
                                                    <p className="text-xs text-gray-400">{teacher.employee_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700 font-medium">
                                                {teacher.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {teacher.personal_info?.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{teacher.join_date || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === "Active"
                                                ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher.status === "Active" ? "bg-green-600" : "bg-yellow-600"
                                                    }`}></span>
                                                {teacher.status || "Active"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        {error ? "Unable to load teachers." : "No teachers found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {selectedTeacher && (
                <TeacherDetailModal
                    teacher={selectedTeacher}
                    onClose={() => setSelectedTeacher(null)}
                    onEdit={handleTeacherUpdated}
                    onDelete={() => handleDeleteTeacher(selectedTeacher.id)}
                />
            )}

            {isAddModalOpen && (
                <AddTeacherModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleTeacherAdded}
                />
            )}
        </div>
    );
}
