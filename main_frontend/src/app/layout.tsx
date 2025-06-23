import type { Metadata } from "next";
import { Inter } from "next/font/google"
import ReduxProvider from "@/providers/redux-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StyleStore - Your Fashion Destination",
  description: "Discover the latest fashion trends for men, women, and kids",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}

