import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/store/Providers";
import LoginModal from "@/components/auth/LoginModal";
import { Toaster } from "@/components/ui/sonner";
import getUserFromServer from "@/lib/auth";
import StoreUser from "@/lib/StoreUser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/Cart";
import Sizechart from "@/components/Sizechart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Denim",
  description: "Denim is a modern e-commerce platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  let user = null;
  try {
    user = await getUserFromServer();
  } catch (error) {
    console.error("Error fetching user in RootLayout:", error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <StoreUser user={user} />
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors />
          <LoginModal />
          <Sizechart />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic"; // Add this to the top of RootLayout