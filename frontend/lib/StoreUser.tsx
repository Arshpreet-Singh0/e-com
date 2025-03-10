"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser, User } from "@/lib/store/features/authSlice";

const StoreUser = ({ user }: { user: User }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(user || null));
  }, [dispatch, user]);

  return null;
};

export default StoreUser;
