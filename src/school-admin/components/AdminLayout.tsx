import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />
            <div className="ml-64">
                <AdminHeader />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
