"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white py-3 px-8 flex justify-between items-center">
      <h1 className="text-lg font-bold tracking-widest">COACHTECH</h1>

      <nav className="flex gap-6 text-sm">
        <Link href="/attendances" className="hover:text-gray-300">
          勤怠
        </Link>

        <Link href="/attendances" className="hover:text-gray-300">
          勤務一覧
        </Link>

        <Link href="/correction_requests" className="hover:text-gray-300">
          申請一覧
        </Link>

        <Link href="#" className="hover:text-gray-300">
          ログアウト
        </Link>
      </nav>
    </header>
  );
}
