"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/components/utils/time";
import Layout from "@/components/Layout";

// 型定義
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <Layout>
      {/* タイトル */}
      <h2 className='text-center text-2xl font-bold my-8'>勤怠一覧</h2>
      {/* テーブル中央寄せコンテナ */}
      <div className='flex justify-center'>
        <div className='w-[900px] bg-white shadow-md rounded-md border border-gray-300'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='bg-gray-100 border-b border-gray-300 text-gray-700'> 
                <th className='py-3 px-4 border'>日付</th>
                <th className='py-3 px-4 border'>名前</th>
                <th className='py-3 px-4 border'>出勤</th>
                <th className='py-3 px-4 border'>退勤</th>
                <th className='py-3 px-4 border'>休憩</th>
                <th className='py-3 px-4 border'>詳細</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className='border-b'>
                  <td className='py-3 px-4 border'>{formatDate(r.date)}</td>
                  <td className='py-3 px-4 border'>{r.user_name}</td>
                  <td className='py-3 px-4 border'>
                    {r.clock_in_time ? formatTime(r.clock_in_time) : "-"}
                  </td>
                  <td className='py-3 px-4 border'>
                    {r.clock_out_time ? formatTime(r.clock_out_time) : "-"}
                  </td>
                  <td className='px-6 py-3 border'>
                    {r.rest_start != null && r.rest_end != null
                      ? `${formatTime(r.rest_start)} ～ ${formatTime(
                          r.rest_end
                        )}`
                      : "-"}
                  </td>
                  
                  <td className='py-3 px-4 border text-blue-600 underline text-center'>
                    <Link href={`/attendances/${r.id}`}>詳細</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
