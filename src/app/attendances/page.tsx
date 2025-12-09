"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/components/utils/time";
import Layout from "@/components/Layout";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_start?: string | null;
  rest_end?: string | null;
};

export default function AttendanceListPage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances`;
    console.log("🔗 Fetching:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setRecords(data))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className='text-center text-gray-600 py-12 text-lg'>
          データを読み込み中です...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ===== タイトル部 ===== */}
      <div className='bg-gray-100 py-8 shadow-inner mb-8'>
        <h2 className='text-center text-2xl font-bold text-gray-800 tracking-wider'>
          勤怠一覧
        </h2>
      </div>

      {/* ===== テーブル全体 ===== */}
      <div className='flex justify-center px-6'>
        <div className='w-full max-w-5xl bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden'>
          <table className='w-full border-collapse text-sm text-gray-700'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 text-gray-700'>
              <tr>
                <th className='py-3 px-4 text-center border-r'>日付</th>
                <th className='py-3 px-4 text-center border-r'>名前</th>
                <th className='py-3 px-4 text-center border-r'>出勤</th>
                <th className='py-3 px-4 text-center border-r'>退勤</th>
                <th className='py-3 px-4 text-center border-r'>休憩</th>
                <th className='py-3 px-4 text-center'>操作</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='py-6 text-center text-gray-500 italic'
                  >
                    勤怠データがありません。
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b hover:bg-gray-50 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className='py-3 px-4 border-r text-center font-medium text-gray-800'>
                      {formatDate(r.date)}
                    </td>
                    <td className='py-3 px-4 border-r text-center'>
                      <Link
                        href={`/attendances/user/${r.user_id}`} // ← user_id を使用
                        className='text-blue-600 hover:text-blue-800 underline'
                      >
                        {r.user_name}
                      </Link>
                    </td>
                    {/* <td className='py-3 px-4 border-r text-center'>
                      {r.user_name}
                    </td> */}
                    <td className='py-3 px-4 border-r text-center'>
                      {r.clock_in_time ? formatTime(r.clock_in_time) : "―"}
                    </td>
                    <td className='py-3 px-4 border-r text-center'>
                      {r.clock_out_time ? formatTime(r.clock_out_time) : "―"}
                    </td>
                    <td className='py-3 px-4 border-r text-center text-gray-700'>
                      {r.rest_start && r.rest_end
                        ? `${formatTime(r.rest_start)} ～ ${formatTime(
                            r.rest_end
                          )}`
                        : "―"}
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <Link
                        href={`/attendances/${r.id}`}
                        className='inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition'
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
