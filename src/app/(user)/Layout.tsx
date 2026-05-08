"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function UserLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const role = localStorage.getItem("role");

    if (!isLogin || role !== "user") {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
