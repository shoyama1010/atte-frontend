"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CorrectionRequest = {
  id: number;
  user_name: string;
  target_date: string;
  status: string;
};

export default function AdminCorrectionListPage() {
  const [list, setList] = useState<CorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    // ✅ 環境変数を使用して、API URLを一元管理
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/correction-requests?status=${status}`;

    console.log("🔗 Fetching:", apiUrl); // デバッグ確認用

    fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setList(data))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>申請一覧（管理者）</h1>

      {/* ▼ タブ切り替え */}
      <div className='flex gap-4 mb-6'>
        <button
          onClick={() => setStatus("pending")}
          className={`px-4 py-2 rounded ${
            status === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          承認待ち
        </button>
        <button
          onClick={() => setStatus("approved")}
          className={`px-4 py-2 rounded ${
            status === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          承認済み
        </button>
      </div>

      {/* ▼ テーブル */}
      <table className='w-full border border-gray-300 bg-white'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='p-3 border'>ユーザー</th>
            <th className='p-3 border'>対象日</th>
            <th className='p-3 border'>ステータス</th>
            <th className='p-3 border'>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: CorrectionRequest) => (
            <tr key={item.id} className='border-b'>
              <td className='p-3 border'>{item.user_name}</td>
              <td className='p-3 border'>{item.target_date}</td>
              <td className='p-3 border'>{item.status}</td>
              <td className='p-3 border text-center'>
                <Link
                  href={`/admin/corrections/${item.id}`}
                  className='px-3 py-1 bg-black text-white text-sm rounded'
                >
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
