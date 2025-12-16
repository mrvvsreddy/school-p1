"use client";

import React, { useState } from "react";
import { createTeacher } from "@/school-admin/services/teacherService";

interface AddTeacherModalProps {
    onClose: () => void;
    onAdd: () => void;  // Changed to callback after success
}

export default function AddTeacherModal({ onClose, onAdd }: AddTeacherModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        employee_id: "",
        subject: "",
        designation: "",
        join_date: "",
        // Personal info
        email: "",
        dob: "",
        address: "",
        phone: "",
        salary: "",
        bank_account: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Build personal_info object
            const personal_info: Record<string, string> = {};
            if (formData.email) personal_info.email = formData.email;
            if (formData.dob) personal_info.dob = formData.dob;
            if (formData.address) personal_info.address = formData.address;
            if (formData.phone) personal_info.phone = formData.phone;
            if (formData.salary) personal_info.salary = formData.salary;
            if (formData.bank_account) personal_info.bank_account = formData.bank_account;

            await createTeacher({
                // School columns (fixed)
                name: formData.name,
                employee_id: formData.employee_id,
                subject: formData.subject,
                designation: formData.designation || undefined,
                join_date: formData.join_date || undefined,
                status: "Active",
                // Flexible personal info
                personal_info: Object.keys(personal_info).length > 0 ? personal_info : undefined,
            });
            onAdd();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add teacher");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-fadeIn h-[85vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800">Add New Teacher</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} id="addTeacherForm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info Column */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                    Personal Information
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">FULL NAME *</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] transition-all"
                                            placeholder="Enter teacher's full name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">EMPLOYEE ID *</label>
                                            <input
                                                required
                                                name="employee_id"
                                                value={formData.employee_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="TCH001"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">DATE OF BIRTH</label>
                                            <input
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] placeholder-gray-400"
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">CONTACT NUMBER</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">EMAIL ADDRESS</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="teacher@school.edu"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADDRESS</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Full residential address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional & Financial Info Column */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                        Professional Details
                                    </h4>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">SUBJECT *</label>
                                        <select
                                            required
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Subject</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="English">English</option>
                                            <option value="Physics">Physics</option>
                                            <option value="Chemistry">Chemistry</option>
                                            <option value="Biology">Biology</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Social Science">Social Science</option>
                                            <option value="Computer">Computer</option>
                                            <option value="Physical Education">Physical Education</option>
                                            <option value="Accountancy">Accountancy</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">DESIGNATION</label>
                                            <input
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="e.g. Senior Teacher, HOD"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">JOINING DATE</label>
                                            <input
                                                name="join_date"
                                                value={formData.join_date}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] placeholder-gray-400"
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                        Financial Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">SALARY (MONTHLY)</label>
                                            <input
                                                name="salary"
                                                value={formData.salary}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="e.g. 50000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">BANK ACCOUNT</label>
                                            <input
                                                name="bank_account"
                                                value={formData.bank_account}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                                placeholder="Account Number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="addTeacherForm"
                        disabled={loading}
                        className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Teacher
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
