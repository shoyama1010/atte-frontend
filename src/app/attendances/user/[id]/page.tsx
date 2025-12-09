"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { useSearchParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { formatDate, formatTime } from "@/components/utils/time";

type Attendance = {
  id: number;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_start?: string | null;
  rest_end?: string | null;
  rest_display?: string | null;
};

export default function UserAttendancePage() {
  const { id } = useParams(); // ★ ← ここでURLパラメータを取得
  const searchParams = useSearchParams();
  const defaultMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(searchParams.get("month") || defaultMonth);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const id = 1; // ★ 現時点では仮のユーザーID（ログイン情報連携時に差し替え）

  // 月移動
  const moveMonth = (n: number) => {
    const [y, m] = month.split("-").map(Number);
    const next = new Date(y, m - 1 + n);
    const newMonth = next.toISOString().slice(0, 7);
    setMonth(newMonth);
    router.push(`/attendances/user?month=${newMonth}`);
  };

  // API取得
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

        // どちらの形式でも対応できるように安全に処理
        if (data.user && data.user.name) {
          setUserName(data.user.name);
        } else if (data.user_name) {
          setUserName(data.user_name);
        } else {
          setUserName("不明なユーザー");
        }
        // setUserName(data.user.name);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [id, month]);

  if (loading)
    return (
      <Layout>
        <p className='text-center text-gray-500 py-12 text-lg'>読み込み中...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className='max-w-4xl mx-auto py-10'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          {userName} さんの勤怠一覧
        </h2>

        {/* 月移動 */}
        <div className='flex justify-center items-center gap-6 mb-8'>
          <button
            onClick={() => moveMonth(-1)}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
          >
            &lt; 前月
          </button>
          <span className='text-xl font-semibold'>{month}</span>
          <button
            onClick={() => moveMonth(1)}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
          >
            翌月 &gt;
          </button>
        </div>

        {/* テーブル */}
        <table className='w-full border border-gray-300 text-sm text-gray-700 bg-white shadow-md'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='py-2 border'>日付</th>
              <th className='py-2 border'>出勤</th>
              <th className='py-2 border'>退勤</th>
              <th className='py-2 border'>休憩</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className='text-center py-6 text-gray-400 italic'
                >
                  データがありません
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className='border-b'>
                  <td className='py-2 px-3 text-center'>
                    {formatDate(r.date)}
                  </td>
                  <td className='py-2 px-3 text-center'>
                    {r.clock_in_time ? formatTime(r.clock_in_time) : "―"}
                  </td>
                  <td className='py-2 px-3 text-center'>
                    {r.clock_out_time ? formatTime(r.clock_out_time) : "―"}
                  </td>
                  <td className='py-2 px-3 text-center'>
                    {r.rest_display
                      ? r.rest_display // Laravelで生成した "11:30～12:00／15:00～15:17" 等をそのまま表示
                      : "―"}
                    {/* {r.rest_start && r.rest_end
                      ? `${formatTime(r.rest_start)} ～ ${formatTime(
                          r.rest_end
                        )}`
                      : "―"} */}
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
