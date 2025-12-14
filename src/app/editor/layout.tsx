import React from "react";
import AuthGuard from "@/components/AuthGuard";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard requiredRole="any">
            <div className="min-h-screen bg-[#F8F9FA]">
                {children}
            </div>
        </AuthGuard>
    );
}

