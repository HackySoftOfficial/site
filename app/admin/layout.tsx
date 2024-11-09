import { AdminAuthProvider } from "@/components/admin/auth-provider";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}