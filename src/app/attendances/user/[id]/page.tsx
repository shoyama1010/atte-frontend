"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";

type AttendanceRecord = {
  id: number;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_display?: string | null;
  // rest_start?: string | null;
  // rest_end?: string | null;
};

export default function UserAttendancePage() {
  const { id } = useParams();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [month, setMonth] = useState("2025-12");
  const [loading, setLoading] = useState(true);
  // 時間フォーマット（"2025-12-08T06:54:00.000000Z" → "06:54"）
  const formatTime = (datetime: string | null) => {
    if (!datetime) return "―";
    const d = new Date(datetime);
    return d.toTimeString().slice(0, 5); // "06:54"
  };

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/user/${id}?month=${month}`;
    console.log("Fetching:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRecords(data.records);
        setUserName(data.user?.name || "");
      })
      .catch((err) => console.error("API ERROR:", err))
      .finally(() => setLoading(false));
  }, [id, month]);

  if (loading) return <Layout>読み込み中...</Layout>;

  const changeMonth = (offset: number) => {
    const current = new Date(month + "-01");
    current.setMonth(current.getMonth() + offset);
    setMonth(current.toISOString().slice(0, 7));
  };

  return (
    <Layout>
      <div className='px-4 py-8 bg-gray-200 rounded-md'>
        <h2 className='text-center text-2xl font-bold mb-6'>
          {userName ? `${userName} さんの勤怠一覧` : "勤怠一覧"}
        </h2>

        <div className='text-center mb-6 flex justify-center items-center space-x-4'>
          <button
            onClick={() => changeMonth(-1)}
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
          >
            ＜ 前月
          </button>
          <span className='text-xl font-semibold'>{month}</span>
          <button
            onClick={() => changeMonth(1)}
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
          >
            翌月 ＞
          </button>
        </div>

        <table className='w-full border border-gray-400 bg-white shadow-md'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='py-2 border-r'>日付</th>
              <th className='py-2 border-r'>出勤</th>
              <th className='py-2 border-r'>退勤</th>
              <th className='py-2'>休憩</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className='text-center py-6 text-gray-500 italic'
                >
                  データがありません。
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className='border-b'>
                  <td className='py-2 text-center'>{r.date}</td>
                  <td className='py-2 text-center'>
                    {formatTime(r.clock_in_time)}
                  </td>
                  <td className='py-2 text-center'>
                    {formatTime(r.clock_out_time)}
                  </td>
                  <td className='py-2 text-center'>{r.rest_display ?? "―"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
