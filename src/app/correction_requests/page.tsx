"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";

type CorrectionRequest = {
  id: number;
  status: string;
  user_name: string;
  request_date: string;
  target_date: string;
  reason: string;
};

export default function CorrectionListPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    // fetch(`http://localhost:8080/api/correction-requests?status=${tab}`)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/correction-requests?status=${tab}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [tab]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">申請一覧</h2>

      {/* タブ切り替え */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded ${
            tab === "pending"
              ? "bg-yellow-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          未承認
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`px-4 py-2 rounded ${
            tab === "approved"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          承認済
        </button>
      </div>

      {/* 一覧テーブル */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4">状態</th>
              <th className="py-3 px-4">名前</th>
              <th className="py-3 px-4">申請日時</th>
              <th className="py-3 px-4">対象日時</th>
              <th className="py-3 px-4">申請理由</th>
              <th className="py-3 px-4 text-center">詳細</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.status === "pending" ? "未承認" : "承認済"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{r.user_name}</td>
                  <td className="py-3 px-4">{r.request_date}</td>
                  <td className="py-3 px-4">{r.target_date}</td>
                  <td className="py-3 px-4">{r.reason}</td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`/correction_requests/${r.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      詳細
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  申請データがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-sm">
        <Link
          href="/attendances"
          className="text-blue-600 hover:underline inline-flex items-center"
        >
          ← 勤怠一覧へ戻る
        </Link>
      </div>
    </Layout>
  );
}
