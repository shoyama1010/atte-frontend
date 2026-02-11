"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/app/(user)/Layout";

type AttendanceRecord = {
  id: number;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  // rest_display: string | null;
  rest_total: string; // ★追加
  total_work: string | null;
};

export default function UserAttendancePage() {
  const { id } = useParams();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [month, setMonth] = useState("2025-12");
  const [loading, setLoading] = useState(true);

  // "2025-12-08T06:54:00Z" → "06:54"
  const formatTime = (time: string | null) => {
    return time ?? "―"; // Laravel で "07:30" に整形済み
  };

  useEffect(() => {
    if (!id) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/user/${id}/monthly?month=${month}`;

    console.log("Fetching:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);

        setRecords(data.records);
        setUserName(data.user?.name || "");
      })
      .catch((err) => console.error("API ERROR:", err))
      .finally(() => setLoading(false));

  }, [id, month]);  // 依存配列
  
  if (loading) return <Layout>読み込み中...</Layout>;

  // 月移動
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

        {/* 月移動 */}
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

        {/* 勤怠テーブル */}
        <table className='w-full border border-gray-400 bg-white shadow-md'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='py-2 border-r'>日付</th>
              <th className='py-2 border-r'>出勤</th>
              <th className='py-2 border-r'>退勤</th>
              <th className='py-2 border-r'>休憩</th>
              <th className='py-2'>合計</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td className='py-2 text-center'>
                    {r.rest_total ?? "00:00"}
                   
                  </td>
                  <td className='py-2 text-center'>
                    {r.total_work ?? "00:00"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
