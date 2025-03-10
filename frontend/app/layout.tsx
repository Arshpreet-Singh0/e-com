import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/store/Providers";
import LoginModal from "@/components/auth/LoginModal";
import { Toaster } from "@/components/ui/sonner"
import getUserFromServer from "@/lib/auth";
import StoreUser from "@/lib/StoreUser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
}: Readonly<{
  children: React.ReactNode;
  
}>) {
  
  const user = await getUserFromServer();
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <StoreUser user={user}/>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors/>
          <LoginModal />
        </Providers>
        
      </body>
    </html>
  );
}
