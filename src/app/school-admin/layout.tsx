import AdminSidebar from "@/school-admin/components/AdminSidebar";
import AdminHeader from "@/school-admin/components/AdminHeader";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard requiredRole="admin">
            <div className="min-h-screen bg-[#F8F9FA]">
                <AdminSidebar />
                <div className="ml-64">
                    <AdminHeader />
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </AuthGuard>
    );
}
