"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleAdminLogin = () => {
    localStorage.setItem("isLogin", "true"); 
    localStorage.setItem("role", "admin");
    // ダミーログイン
    router.push("/admin/corrections/list");
  };

  // 一般ユーザーログイン
  const handleUserLogin = () => {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("role", "user"); // ★重要
    router.push("/attendances"); // 一般側トップ
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow rounded w-80 text-center">
        <h2 className="text-xl font-bold mb-6">ログイン</h2>

        <button
          onClick={handleAdminLogin}
          className="w-full bg-black text-white py-2 rounded mb-4"
        >
          管理者ログイン
        </button>

        <button
          onClick={handleUserLogin}
          className="w-full bg-gray-500 text-white py-2 rounded"
        >
          一般ユーザーログイン
        </button>
      </div>
    </div>
  );
}