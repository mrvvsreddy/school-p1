"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import ExamDetailModal from "@/school-admin/components/ExamDetailModal";
import AddExamModal from "@/school-admin/components/AddExamModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ExamStatus = "Draft" | "Scheduled" | "Completed";

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

interface AcademicYear {
    id: string;
    year_name: string;
    is_current: boolean;
}

const gradeOptions = [
    { value: "", label: "All Classes" },
    { value: "Grade 9", label: "Grade 9" },
    { value: "Grade 10", label: "Grade 10" },
    { value: "Grade 11", label: "Grade 11" },
    { value: "Grade 12", label: "Grade 12" },
];

const getStatusStyles = (status: ExamStatus) => {
    switch (status) {
        case "Scheduled": return { bg: "bg-[#C4A35A]/10", text: "text-[#C4A35A]", dot: "bg-[#C4A35A]" };
        case "Draft": return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
        case "Completed": return { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" };
        default: return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

const ITEMS_PER_PAGE = 9;

interface DropdownMenuProps {
    exam: Exam;
    currentStatus: ExamStatus;
    onEdit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onMarkStatus: (status: ExamStatus) => void;
}

function DropdownMenu({ exam, currentStatus, onEdit, onDuplicate, onDelete, onMarkStatus }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isCompleted = currentStatus === "Completed";

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 text-xs">
                    {!isCompleted && (
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); setIsOpen(false); }} className="w-full px-2.5 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDuplicate(); setIsOpen(false); }} className="w-full px-2.5 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Duplicate
                    </button>
                    {currentStatus === "Draft" && (
                        <button onClick={(e) => { e.stopPropagation(); onMarkStatus("Scheduled"); setIsOpen(false); }} className="w-full px-2.5 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Schedule
                        </button>
                    )}
                    {currentStatus === "Scheduled" && (
                        <button onClick={(e) => { e.stopPropagation(); onMarkStatus("Draft"); setIsOpen(false); }} className="w-full px-2.5 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            To Draft
                        </button>
                    )}
                    <div className="border-t border-gray-100 my-0.5"></div>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }} className="w-full px-2.5 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ExamPage() {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [activeYear, setActiveYear] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch academic years
    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/exams/academic-years/list`);
                if (!res.ok) throw new Error("Failed to fetch academic years");
                const data = await res.json();
                setAcademicYears(data.academic_years || []);
                // Set current year as active
                const current = data.academic_years?.find((y: AcademicYear) => y.is_current);
                setActiveYear(current?.year_name || data.academic_years?.[0]?.year_name || "");
            } catch (err) {
                console.error("Error fetching academic years:", err);
                setError("Failed to load academic years. Please ensure the server is running.");
            }
        };
        fetchAcademicYears();
    }, []);

    // Fetch exams
    const fetchExams = useCallback(async () => {
        if (!activeYear) return;
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ academic_year: activeYear, page_size: "100" });
            if (selectedGrade) params.append("grade", selectedGrade);
            if (searchQuery) params.append("search", searchQuery);

            const res = await fetch(`${API_BASE}/api/exams?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch exams");
            const data = await res.json();
            setExams(data.exams);
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError("Failed to load exams");
            setExams([]);
        } finally {
            setLoading(false);
        }
    }, [activeYear, selectedGrade, searchQuery]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const filteredExams = useMemo(() => {
        return exams.sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
    }, [exams]);

    const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
    const paginatedExams = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredExams, currentPage]);

    const handleYearChange = (year: string) => { setActiveYear(year); setCurrentPage(1); };
    const handleSearchChange = (value: string) => { setSearchQuery(value); setCurrentPage(1); };
    const handleGradeChange = (value: string) => { setSelectedGrade(value); setCurrentPage(1); };
    const handleExamClick = (exam: Exam) => { setSelectedExam(exam); setIsDetailModalOpen(true); };
    const handleEditExam = (exam: Exam) => { setEditingExam(exam); setIsAddModalOpen(true); };

    const handleAddExam = async (newExamData: { subject: string; grade: string; academicYear: string; date: string; startTime: string; endTime: string; duration: string; location: string; color: string; }) => {
        try {
            const res = await fetch(`${API_BASE}/api/exams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: newExamData.subject,
                    grade: newExamData.grade,
                    academic_year: newExamData.academicYear,
                    exam_date: newExamData.date,
                    start_time: newExamData.startTime,
                    end_time: newExamData.endTime,
                    duration: newExamData.duration,
                    location: newExamData.location,
                    color: newExamData.color,
                    status: "Scheduled",
                    participants: 0,
                }),
            });
            if (!res.ok) throw new Error("Failed to create exam");
            fetchExams();
        } catch (err) {
            console.error("Error creating exam:", err);
            alert("Failed to create exam");
        }
    };

    const handleUpdateExam = async (updatedExam: Exam) => {
        try {
            const res = await fetch(`${API_BASE}/api/exams/${updatedExam.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: updatedExam.subject,
                    grade: updatedExam.grade,
                    academic_year: updatedExam.academic_year,
                    exam_date: updatedExam.exam_date,
                    start_time: updatedExam.start_time,
                    end_time: updatedExam.end_time,
                    duration: updatedExam.duration,
                    location: updatedExam.location,
                    color: updatedExam.color,
                    status: updatedExam.status,
                    participants: updatedExam.participants,
                }),
            });
            if (!res.ok) throw new Error("Failed to update exam");
            fetchExams();
        } catch (err) {
            console.error("Error updating exam:", err);
            alert("Failed to update exam");
        }
    };

    const handleDuplicateExam = async (exam: Exam) => {
        try {
            const res = await fetch(`${API_BASE}/api/exams/${exam.id}/duplicate`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to duplicate exam");
            fetchExams();
        } catch (err) {
            console.error("Error duplicating exam:", err);
            alert("Failed to duplicate exam");
        }
    };

    const handleDeleteExam = async (examId: string) => {
        if (!confirm("Delete this exam?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/exams/${examId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete exam");
            fetchExams();
        } catch (err) {
            console.error("Error deleting exam:", err);
            alert("Failed to delete exam");
        }
    };

    const handleMarkStatus = async (examId: string, status: ExamStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/exams/${examId}/status?status=${status}`, { method: "PATCH" });
            if (!res.ok) throw new Error("Failed to update status");
            fetchExams();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        }
    };

    const handleModalClose = () => { setIsAddModalOpen(false); setEditingExam(null); };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-[#1A1A1A]">Examination Schedule</h1>
                    <p className="text-xs text-gray-500">Manage exams by academic year</p>
                </div>
                <button onClick={() => { setEditingExam(null); setIsAddModalOpen(true); }} className="bg-[#C4A35A] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#A38842] transition-colors flex items-center gap-1.5 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Exam
                </button>
            </div>

            {/* Year Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    {academicYears.map((year) => (
                        <button key={year.id} onClick={() => handleYearChange(year.year_name)} className={`py-2 px-1 border-b-2 text-xs font-medium transition-colors cursor-pointer ${activeYear === year.year_name ? "border-[#C4A35A] text-[#C4A35A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                            {year.year_name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="flex-1 max-w-sm relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search exams..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C4A35A] focus:border-[#C4A35A]" />
                </div>
                <div className="flex items-center gap-2">
                    <select value={selectedGrade} onChange={(e) => handleGradeChange(e.target.value)} className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer">
                        {gradeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{paginatedExams.length} of {filteredExams.length} exams{searchQuery && ` • "${searchQuery}"`}{selectedGrade && ` • ${selectedGrade}`}</span>
                {(searchQuery || selectedGrade) && (<button onClick={() => { setSearchQuery(""); setSelectedGrade(""); }} className="text-[#C4A35A] hover:underline cursor-pointer">Clear</button>)}
            </div>

            {/* Loading / Error / Exam Cards */}
            {loading ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
                    <div className="animate-spin w-8 h-8 border-2 border-[#C4A35A] border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading exams...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-lg p-8 text-center border border-red-100">
                    <p className="text-sm text-red-500">{error}</p>
                    <button onClick={fetchExams} className="mt-2 text-[#C4A35A] text-sm font-medium hover:underline cursor-pointer">Retry</button>
                </div>
            ) : filteredExams.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">No exams found</h3>
                    <button onClick={() => { setEditingExam(null); setIsAddModalOpen(true); }} className="text-[#C4A35A] text-sm font-medium hover:underline cursor-pointer">+ Add exam</button>
                </div>
            ) : (
                <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {paginatedExams.map((exam) => {
                        const currentStatus = exam.status as ExamStatus;
                        const statusStyles = getStatusStyles(currentStatus);
                        const isCompleted = currentStatus === "Completed";

                        return (
                            <div key={exam.id} onClick={() => handleExamClick(exam)} className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C4A35A]/30 transition-all cursor-pointer ${isCompleted ? "opacity-85" : ""}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${exam.color}15` }}>
                                            <svg className="w-4 h-4" style={{ color: exam.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{exam.subject}</h3>
                                            <p className="text-xs text-gray-500">{exam.grade}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                        {!isCompleted && (
                                            <button onClick={(e) => { e.stopPropagation(); handleEditExam(exam); }} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        )}
                                        <DropdownMenu exam={exam} currentStatus={currentStatus} onEdit={() => handleEditExam(exam)} onDuplicate={() => handleDuplicateExam(exam)} onDelete={() => handleDeleteExam(exam.id)} onMarkStatus={(status) => handleMarkStatus(exam.id, status)} />
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs text-gray-600 mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span>{formatDate(exam.exam_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles.bg}`}>
                                        <span className={`w-1 h-1 rounded-full ${statusStyles.dot}`}></span>
                                        <span className={statusStyles.text}>{currentStatus}</span>
                                    </div>
                                    {exam.participants > 0 && <span className="text-[10px] text-gray-400">{exam.participants} students</span>}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Card */}
                    <div onClick={() => { setEditingExam(null); setIsAddModalOpen(true); }} className="bg-white rounded-lg p-3 border-2 border-dashed border-gray-200 hover:border-[#C4A35A] transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[140px] group">
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#C4A35A]/10 flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Add Exam</span>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 rounded text-xs font-medium cursor-pointer ${currentPage === page ? "bg-[#C4A35A] text-white" : "hover:bg-gray-100 text-gray-600"}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}

            {/* Modals */}
            <ExamDetailModal exam={selectedExam} isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedExam(null); }} onEdit={(exam) => { setIsDetailModalOpen(false); setSelectedExam(null); handleEditExam(exam); }} />
            <AddExamModal isOpen={isAddModalOpen} onClose={handleModalClose} onAdd={handleAddExam} editExam={editingExam} onUpdate={handleUpdateExam} />
        </div>
    );
}
