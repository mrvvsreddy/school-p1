"use client";

import React, { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Contact {
    id: string;
    name: string;
    email: string;
    dial_code: string;
    phone: string;
    subject?: string;
    message: string;
    status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, [filter]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== "all") params.append("status", filter);
            if (searchQuery) params.append("search", searchQuery);

            const res = await fetch(`${API_BASE}/api/contacts?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setContacts(data.contacts || []);
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchContacts();
    };

    const updateStatus = async (id: string, status: string, closeModal: boolean = false) => {
        try {
            const res = await fetch(`${API_BASE}/api/contacts/${id}/status?status=${status}`, {
                method: "PATCH",
            });
            if (res.ok) {
                await fetchContacts();
                if (closeModal) {
                    setSelectedContact(null);
                } else if (selectedContact && selectedContact.id === id) {
                    setSelectedContact({ ...selectedContact, status });
                }
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact request?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchContacts();
                setSelectedContact(null);
            }
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "replied": return "bg-green-100 text-green-700";
            case "closed": return "bg-gray-100 text-gray-600";
            case "read": return "bg-blue-100 text-blue-700";
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

    const getSubjectLabel = (subject?: string) => {
        const subjects: Record<string, string> = {
            admission: "Admission Enquiry",
            fees: "Fee Structure",
            academics: "Academics",
            transport: "Transport",
            other: "Other"
        };
        return subjects[subject || ""] || subject || "General";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#333]">Contact Requests</h1>
                    <p className="text-sm text-gray-500">Manage messages from website visitors</p>
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
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {["all", "new", "read", "replied", "closed"].map((status) => (
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

                {(filter !== "all" || searchQuery) && (
                    <button
                        onClick={() => {
                            setFilter("all");
                            setSearchQuery("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-[#43a047] border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p>No contact requests found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Message</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {contacts.map((contact) => (
                                <tr
                                    key={contact.id}
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        if (contact.status === "new") {
                                            updateStatus(contact.id, "read");
                                        }
                                    }}
                                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${contact.status === "new" ? "bg-amber-50/50" : ""}`}
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className={`font-medium ${contact.status === "new" ? "text-[#333]" : "text-gray-600"}`}>{contact.name}</p>
                                            <p className="text-xs text-gray-400">{contact.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600">{getSubjectLabel(contact.subject)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{contact.message}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">{formatDate(contact.created_at)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contact.status)}`}>
                                            {contact.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedContact(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-[#333]">Contact Request</h3>
                                <p className="text-xs text-gray-400">Received on {formatDateTime(selectedContact.created_at)}</p>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Name</label>
                                        <p className="font-medium text-[#333]">{selectedContact.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Phone</label>
                                        <p className="text-gray-600">{selectedContact.dial_code} {selectedContact.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase">Email</label>
                                        <p className="text-gray-600">{selectedContact.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Message</h4>
                                <div className="mb-2">
                                    <label className="text-xs text-gray-400 uppercase">Subject</label>
                                    <p className="font-medium text-[#333]">{getSubjectLabel(selectedContact.subject)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 border-b pb-2">Status</h4>
                                <div className="flex items-center gap-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedContact.status)}`}>
                                        {selectedContact.status}
                                    </span>
                                    <span className="text-xs text-gray-400">Last updated: {formatDateTime(selectedContact.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-100 flex items-center gap-3 sticky bottom-0 bg-white">
                            {selectedContact.status !== "replied" && (
                                <button
                                    onClick={() => updateStatus(selectedContact.id, "replied")}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors cursor-pointer"
                                >
                                    Mark as Replied
                                </button>
                            )}
                            {selectedContact.status !== "closed" && (
                                <button
                                    onClick={() => updateStatus(selectedContact.id, "closed", true)}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            )}
                            <button
                                onClick={() => deleteContact(selectedContact.id)}
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
