import OrdersPage from "@/components/order/OrderPage";
import { BACKEND_URL } from "@/config/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const getOrders = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return null;
        }

        const res = await fetch(`${BACKEND_URL}/api/v1/order`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`,
            },
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch orders");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};
export default async function Page() {
    const orders = await getOrders();
    
    if(orders==null) redirect('/');
    
    return (
        <OrdersPage orders={orders}/>
    )
}