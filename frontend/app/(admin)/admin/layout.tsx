import ProtectedRoutes from "@/components/admin/ProtectedRoutes";
import Sidebar from "@/components/admin/Sidebar";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProtectedRoutes />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
