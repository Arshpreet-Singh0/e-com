import ProtectedRoutes from "@/components/admin/ProtectedRoutes";

export default async function Layout({
    children,
  }: Readonly<{ children: React.ReactNode }>){
        return (
            <>
            <ProtectedRoutes />
            {children}
            </>
        )
  }