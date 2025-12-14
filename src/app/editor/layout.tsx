import React from "react";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {children}
        </div>
    );
}

