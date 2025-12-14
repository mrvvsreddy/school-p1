"use client";

import React, { useState } from "react";

interface AddStudentModalProps {
    onClose: () => void;
    onAdd: (student: any) => void;
}

export default function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        rollNo: "",
        status: "Present",
        dob: "",
        address: "",
        contact: "",
        parents: {
            father: "",
            mother: "",
            phone: ""
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("parent.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                parents: {
                    ...prev.parents,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Increased width to max-w-4xl and reduced padding */}
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
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

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">FULL NAME</label>
                                    <input required name="name" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] transition-all" placeholder="Enter student's full name" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS</label>
                                        <select required name="class" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer">
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
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">ROLL NO</label>
                                        <input required name="rollNo" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Ex: 001" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">DATE OF BIRTH</label>
                                        <input required name="dob" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] placeholder-gray-400" placeholder="DD/MM/YYYY" />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADDRESS</label>
                                    <input required name="address" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Full residential address" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Family & Contact Details
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">STUDENT CONTACT</label>
                                    <input required name="contact" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">FATHER'S NAME</label>
                                        <input required name="parent.father" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Name" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">MOTHER'S NAME</label>
                                        <input required name="parent.mother" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">PARENT'S CONTACT (PRIMARY)</label>
                                    <input required name="parent.phone" onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
