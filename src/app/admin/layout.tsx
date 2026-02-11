"use client";

// import Link from "next/link";
import type { ReactNode } from "react";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminHeader />
      
      <main className='px-4 py-8 bg-gray-100 min-h-screen'>{children}</main>
    </>
  );
}

