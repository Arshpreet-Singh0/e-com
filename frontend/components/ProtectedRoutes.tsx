"use client";

import { openLoginModal } from "@/lib/store/features/loginModalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedRoutes = () => {
    const { user } = useAppSelector(store=>store.auth);

    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(()=>{
        if(!user){
            toast.error("You are not logined in");
            dispatch(openLoginModal());
            router.push("/");
        }
    },[user, router, dispatch]);
  return (
    null
  )
}

export default ProtectedRoutes;