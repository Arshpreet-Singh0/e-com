"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedRoutes = () => {
    const { user } = useAppSelector(store=>store.auth);

    const router = useRouter();

    useEffect(()=>{
        if(!user || user.role !== "admin"){
            toast.error("You are not authorized to access this page");
            router.push("/");
        }
    },[user, router]);
  return (
    null
  )
}

export default ProtectedRoutes