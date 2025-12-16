"use client";

import React, { useState } from "react";
import { createStudent } from "@/school-admin/services/studentService";

interface AddStudentModalProps {
    onClose: () => void;
    onAdd: () => void;  // Changed to callback after success
}

export default function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        class: "",
        roll_no: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        father_name: "",
        mother_name: "",
        guardian_phone: "",
        admission_no: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Build personal_info object with all personal data
            const personal_info: Record<string, string> = {};
            if (formData.dob) personal_info.dob = formData.dob;
            if (formData.gender) personal_info.gender = formData.gender;
            if (formData.address) personal_info.address = formData.address;
            if (formData.phone) personal_info.phone = formData.phone;
            if (formData.email) personal_info.email = formData.email;
            if (formData.father_name) personal_info.father_name = formData.father_name;
            if (formData.mother_name) personal_info.mother_name = formData.mother_name;
            if (formData.guardian_phone) personal_info.guardian_phone = formData.guardian_phone;

            await createStudent({
                // School columns (fixed)
                name: formData.name,
                roll_no: formData.roll_no,
                class: formData.class,
                admission_no: formData.admission_no || undefined,
                // Flexible personal info
                personal_info: Object.keys(personal_info).length > 0 ? personal_info : undefined,
            });
            onAdd(); // Callback to refresh list
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add student");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0">
                    <h3 className="text-lg font-bold text-gray-800">Add New Student</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">FULL NAME *</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] transition-all"
                                        placeholder="Enter student's full name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS *</label>
                                        <select
                                            required
                                            name="class"
                                            value={formData.class}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Class</option>
                                            <option value="10-A">10-A</option>
                                            <option value="10-B">10-B</option>
                                            <option value="9-A">9-A</option>
                                            <option value="9-B">9-B</option>
                                            <option value="8-A">8-A</option>
                                            <option value="8-B">8-B</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">ROLL NO *</label>
                                        <input
                                            required
                                            name="roll_no"
                                            value={formData.roll_no}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Ex: 001"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">DATE OF BIRTH</label>
                                        <input
                                            type="text"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">GENDER</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADDRESS</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="Full residential address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADMISSION NO</label>
                                    <input
                                        name="admission_no"
                                        value={formData.admission_no}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="Ex: ADM2024001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Family & Contact Details
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">STUDENT PHONE</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">EMAIL</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="student@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">FATHER&apos;S NAME</label>
                                        <input
                                            name="father_name"
                                            value={formData.father_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">MOTHER&apos;S NAME</label>
                                        <input
                                            name="mother_name"
                                            value={formData.mother_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">GUARDIAN&apos;S CONTACT</label>
                                    <input
                                        name="guardian_phone"
                                        value={formData.guardian_phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
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
                            disabled={loading}
                            className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Student
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
