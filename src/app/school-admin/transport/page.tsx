"use client";

import React from "react";
import { transportRoutes } from "@/school-admin/data/mockData";

export default function TransportPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Transport</h1>
                    <p className="text-gray-500 mt-1">Manage school transport routes and vehicles</p>
                </div>
                <button className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors">
                    + Add Route
                </button>
            </div>

            {/* Transport Routes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#333]">Active Routes</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Route No</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Driver</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Vehicle</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Students</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transportRoutes.map((route) => (
                            <tr key={route.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-[#333]">{route.routeNo}</td>
                                <td className="px-6 py-4 text-gray-600">{route.driver}</td>
                                <td className="px-6 py-4 text-gray-600">{route.vehicle}</td>
                                <td className="px-6 py-4 text-gray-600">{route.students}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${route.status === "Active"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-yellow-100 text-yellow-600"
                                        }`}>
                                        {route.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
