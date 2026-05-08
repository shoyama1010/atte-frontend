"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLogin"); // ★追加
    alert("ログアウトしました");
    // ログイン画面 or トップへ
    router.push("/login"); // ← なければ "/" でもOK
  };

  return (
    <header className='bg-black text-white px-8 py-3 flex justify-between items-center'>
      <h1 className='text-lg font-bold tracking-widest'>COACHTECH</h1>

      <nav className='flex gap-6 text-sm'>
        <Link href='/admin/attendances' className='hover:text-gray-300'>
          勤怠一覧（管理）
        </Link>

        <Link href='/admin/corrections/list' className='hover:text-gray-300'>
          申請一覧
        </Link>

        <Link href='/admin/staffs' className='hover:text-gray-300'>
          スタッフ管理
        </Link>
        
        <button onClick={handleLogout} className='hover:text-gray-300'>
          ログアウト
        </button>
        
      </nav>
    </header>
  );
}
