import ProtectedAdminRoutes from "@/components/admin/ProtectedAdminRoutes";
import Sidebar from "@/components/admin/Sidebar";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProtectedAdminRoutes/>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
