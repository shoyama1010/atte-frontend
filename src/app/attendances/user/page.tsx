"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";

type Attendance = {
  id: number;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_total: string; // 例: "00:45"
  total_work: string; // 例: "07:15"
};

export default function UserAttendancePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // デフォルトは現在の年月
  const defaultMonth = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(defaultMonth);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [userName, setUserName] = useState("");

  // 月の前後を計算する
  const moveMonth = (num: number) => {
    const [year, mon] = month.split("-").map(Number);
    const newDate = new Date(year, mon - 1 + num, 1);
    const newMonth = newDate.toISOString().slice(0, 7);
    router.push(`/attendances/user/${id}?month=${newMonth}`);
    setMonth(newMonth);
  };

  // API 取得
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/user/`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.records);
        setUserName(data.user_name);
      });
  }, [id, month]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">勤怠一覧：{userName}</h2>

      {/* 月ナビ */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => moveMonth(-1)}
        >
          &lt; 前月
        </button>

        <span className="text-xl font-bold">{month} 月</span>

        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => moveMonth(1)}
        >
          翌月 &gt;
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4">日付</th>
              <th className="py-3 px-4">出勤</th>
              <th className="py-3 px-4">退勤</th>
              <th className="py-3 px-4">休憩</th>
              <th className="py-3 px-4">合計</th>
              <th className="py-3 px-4 text-center">詳細</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{r.date}</td>
                  <td className="py-3 px-4">{r.clock_in_time ?? "-"}</td>
                  <td className="py-3 px-4">{r.clock_out_time ?? "-"}</td>
                  <td className="py-3 px-4">{r.rest_total}</td>
                  <td className="py-3 px-4">{r.total_work}</td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`/attendances/${r.id}`}
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
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-sm">
        <Link href="/attendances" className="text-blue-600 hover:underline">
          ← 全体一覧に戻る
        </Link>
      </div>
    </Layout>
  );
}