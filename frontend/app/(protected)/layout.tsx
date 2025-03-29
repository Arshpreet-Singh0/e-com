import ProtectedRoutes from "@/components/ProtectedRoutes";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProtectedRoutes/>
     {children}
    </>
  );
}
