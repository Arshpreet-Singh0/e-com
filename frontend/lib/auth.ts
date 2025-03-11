import { BACKEND_URL } from "@/config/config";
import { cookies } from "next/headers";

export default async function getUserFromServer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token.value}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.error(`Backend request failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.success ? data.user : null;

  } catch (error) {
    return null; // Ensure layout doesn't break
    console.error("Failed to fetch user:", error);
  }
}
