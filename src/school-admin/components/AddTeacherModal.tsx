"use client";

import React, { useState } from "react";

interface AddTeacherModalProps {
    onClose: () => void;
    onAdd: (teacher: any) => void;
}

export default function AddTeacherModal({ onClose, onAdd }: AddTeacherModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        department: "",
        email: "",
        dob: "",
        address: "",
        contact: "",
        joinDate: "",
        salary: "",
        bankAccount: "",
        taxId: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...formData, status: "Active" }); // Default status
        onClose();
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
                    <form onSubmit={handleSubmit} id="addTeacherForm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info Column */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                    Personal Information
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">FULL NAME</label>
                                        <input required name="name" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] transition-all" placeholder="Enter teacher's full name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">DATE OF BIRTH</label>
                                            <input required name="dob" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] placeholder-gray-400" placeholder="DD/MM/YYYY" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">CONTACT NUMBER</label>
                                            <input required name="contact" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">EMAIL ADDRESS</label>
                                        <input required type="email" name="email" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="teacher@school.edu" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADDRESS</label>
                                        <input required name="address" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Full residential address" />
                                    </div>
                                </div>
                            </div>

                            {/* Professional & Financial Info Column */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                        Professional Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">SUBJECT</label>
                                            <select required name="subject" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer">
                                                <option value="">Select Subject</option>
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="English">English</option>
                                                <option value="Science">Science</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">Chemistry</option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Social Science">Social Science</option>
                                                <option value="Computer">Computer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">DEPARTMENT</label>
                                            <select required name="department" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer">
                                                <option value="">Select Department</option>
                                                <option value="Science">Science</option>
                                                <option value="Arts">Arts</option>
                                                <option value="Commerce">Commerce</option>
                                                <option value="Sports">Sports</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">JOINING DATE</label>
                                        <input required name="joinDate" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] placeholder-gray-400" placeholder="DD/MM/YYYY" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                        Financial Information
                                    </h4>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">SALARY (ANNUAL/MONTHLY)</label>
                                        <input required name="salary" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="e.g. 50,000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">BANK ACCOUNT</label>
                                            <input required name="bankAccount" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Account Number" />
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
                        className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="addTeacherForm"
                        className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Add Teacher
                    </button>
                </div>
            </div>
        </div>
    );
}
