"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      
      <main className='px-4 py-8 bg-gray-100 min-h-screen'>{children}</main>
    </>
  );
}

