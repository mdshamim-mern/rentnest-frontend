import type { Metadata } from "next";
import "./globals.css";
import "./readability.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "RentNest | Rental Property Marketplace",
  description: "Find and list rental properties with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-slate-900">
        <Navbar />
        <main className="grow pt-20">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
