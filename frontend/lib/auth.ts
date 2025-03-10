import { BACKEND_URL } from "@/config/config";
import { cookies } from "next/headers";
import axios from "axios";

export default async function getUserFromServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token"); // ✅ Get the token from the cookie

  if (!token) return null; // ⛔ No token, return null (no backend request)

  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/me`, {
        headers: {
          Cookie: `token=${token.value}`,
        },
        withCredentials: true,
      });

    if(res.data.success) {
      return res.data.user;
    }
    return null;
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
} 
