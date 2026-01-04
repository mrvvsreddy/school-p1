"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Application {
    id: string;
    student_name: string;
    parent_name: string;
    email: string;
    phone: string;
    grade_applying: string;
    date_of_birth?: string;
    address?: string;
    previous_school?: string;
    notes?: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [gradeFilter, setGradeFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== "all") params.append("status", filter);
            if (gradeFilter) params.append("grade", gradeFilter);
            if (searchQuery) params.append("search", searchQuery);

            const res = await fetch(`${API_BASE}/api/applications?${params.toString()}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
            }
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, gradeFilter, searchQuery]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchApplications();
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/applications/${id}/status?status=${status}`, {
                method: "PATCH",
                credentials: 'include'
            });
            if (res.ok) {
                fetchApplications();
                setSelectedApp(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/applications/${id}`, {
                method: "DELETE",
                credentials: 'include'
            });
            if (res.ok) {
                fetchApplications();
                setSelectedApp(null);
            }
        } catch (error) {
            console.error("Failed to delete application:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-700";
            case "rejected": return "bg-red-100 text-red-700";
            default: return "bg-amber-100 text-amber-700";
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Get unique grades for filter dropdown
    const uniqueGrades = [...new Set(applications.map(a => a.grade_applying).filter(Boolean))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#333]">Applications</h1>
                    <p className="text-sm text-gray-500">Manage student admission applications</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43a047]/20 w-48"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#43a047] text-white rounded-lg text-sm font-medium hover:bg-[#388e3c] transition-colors cursor-pointer"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Status Filter Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {["all", "pending", "approved", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize cursor-pointer ${filter === status
                                ? "bg-white text-[#333] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Grade Filter */}
                <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43a047]/20 cursor-pointer"
                >
                    <option value="">All Grades</option>
                    {uniqueGrades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>

                {/* Clear Filters */}
                {(filter !== "all" || gradeFilter || searchQuery) && (
                    <button
                        onClick={() => {
                            setFilter("all");
                            setGradeFilter("");
                            setSearchQuery("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-[#43a047] border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No applications found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applied</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {applications.map((app) => (
                                <tr
                                    key={app.id}
                                    onClick={() => setSelectedApp(app)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-[#333]">{app.student_name}</p>
                                            <p className="text-xs text-gray-400">{app.parent_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-600">{app.email}</p>
                                        <p className="text-xs text-gray-400">{app.phone}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-[#333]">{app.grade_applying}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">{formatDate(app.created_at)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedApp(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-[#333]">Application Details</h3>
                                <p className="text-xs text-gray-400">Applied on {formatDateTime(selectedApp.created_at)}</p>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Student Info Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Student Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Student Name</label>
                                        <p className="font-medium text-[#333] text-base">{selectedApp.student_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Date of Birth</label>
                                        <p className="text-gray-600">{selectedApp.date_of_birth ? formatDate(selectedApp.date_of_birth) : "Not provided"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Grade Applying For</label>
                                        <p className="font-medium text-[#333]">{selectedApp.grade_applying}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Previous School</label>
                                        <p className="text-gray-600">{selectedApp.previous_school || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Parent/Contact Info Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Parent / Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Parent Name</label>
                                        <p className="font-medium text-[#333]">{selectedApp.parent_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Phone</label>
                                        <p className="text-gray-600">{selectedApp.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase">Email</label>
                                        <p className="text-gray-600">{selectedApp.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase">Address</label>
                                        <p className="text-gray-600">{selectedApp.address || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Additional Notes</h4>
                                <p className="text-gray-600 text-sm">{selectedApp.notes || "No additional notes"}</p>
                            </div>

                            {/* Status Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Application Status</h4>
                                <div className="flex items-center gap-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedApp.status)}`}>
                                        {selectedApp.status}
                                    </span>
                                    <span className="text-xs text-gray-400">Last updated: {formatDateTime(selectedApp.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-100 flex items-center gap-3 sticky bottom-0 bg-white">
                            {selectedApp.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(selectedApp.id, "approved")}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors cursor-pointer"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedApp.id, "rejected")}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => deleteApplication(selectedApp.id)}
                                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
