import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import Navbar from "@/components/navbar";

import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: "Chat App",
  description: "Using Postgres, Express, Next, and Node",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={`${roboto.className} antialiased min-h-screen flex flex-col bg-gray-100`}>
        <Navbar />
        <main className='flex flex-1 flex-col'>{children}</main>
      </body>
    </html>
  );
}
