"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getStudents, deleteStudent, Student } from "@/school-admin/services/studentService";
import { getClasses, Class } from "@/school-admin/services/classService";
import StudentDetailModal from "@/school-admin/components/StudentDetailModal";
import AddStudentModal from "@/school-admin/components/AddStudentModal";

export default function StudentsPage() {
    // State
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("All");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);

    // Create class lookup map
    const classMap = new Map(classes.map(c => [c.id, c]));

    // Get class display name from class_id
    const getClassName = (classId: string) => {
        const cls = classMap.get(classId);
        return cls ? `${cls.class}-${cls.section}` : classId.slice(0, 8);
    };

    // Fetch classes
    const fetchClasses = useCallback(async () => {
        try {
            const response = await getClasses();
            setClasses(response.classes);
        } catch (err) {
            console.error("Error fetching classes:", err);
        }
    }, []);

    // Fetch students from API
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: { class_id?: string; search?: string } = {};
            if (classFilter !== "All") filters.class_id = classFilter;
            if (searchQuery) filters.search = searchQuery;

            const response = await getStudents(filters);
            setStudents(response.students);
            setTotalStudents(response.total);
        } catch (err) {
            console.error("Error fetching students:", err);
            setError(err instanceof Error ? err.message : "Failed to load students");
        } finally {
            setLoading(false);
        }
    }, [classFilter, searchQuery]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Handle student added
    const handleStudentAdded = () => {
        setIsAddModalOpen(false);
        fetchStudents();
    };

    // Handle student updated
    const handleStudentUpdated = () => {
        setSelectedStudent(null);
        fetchStudents();
    };

    // Handle student delete
    const handleDeleteStudent = async (studentId: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return;

        try {
            await deleteStudent(studentId);
            fetchStudents();
            setSelectedStudent(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete student");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Students</h1>
                    <p className="text-gray-500 mt-1">Manage all students in the school</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{totalStudents}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Active Students</p>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{students.filter(s => s.is_active !== false).length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Classes</p>
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                    <p className="text-2xl font-bold text-[#333] mt-2">{classes.length}</p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading students</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchStudents}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Students Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-[#333]">All Students</h3>

                        <div className="flex items-center gap-3">
                            {/* Class Filter */}
                            <select
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                            >
                                <option value="All">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.class}-{cls.section}</option>
                                ))}
                            </select>

                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or roll no..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchStudents}
                                disabled={loading}
                                className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <svg className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && students.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#C4A35A] border-t-transparent"></div>
                        <p className="mt-4 text-gray-500">Loading students...</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parents</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {student.photo_url ? (
                                                    <img
                                                        src={student.photo_url}
                                                        alt={student.name}
                                                        className="w-9 h-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-[#C4A35A]/10 flex items-center justify-center text-[#C4A35A] font-medium text-sm">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm text-[#333]">{student.name}</p>
                                                    <p className="text-xs text-gray-400">ID: {student.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                                                {getClassName(student.class_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">#{student.roll_no}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700">{student.personal_info?.father_name || "N/A"}</span>
                                                <span className="text-[10px] text-gray-400">Father</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{student.personal_info?.phone || student.personal_info?.guardian_phone || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        {error ? "Unable to load students." : "No students found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    className={getClassName(selectedStudent.class_id)}
                    onClose={() => setSelectedStudent(null)}
                    onEdit={handleStudentUpdated}
                    onDelete={() => handleDeleteStudent(selectedStudent.id)}
                />
            )}

            {isAddModalOpen && (
                <AddStudentModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleStudentAdded}
                />
            )}
        </div>
    );
}
