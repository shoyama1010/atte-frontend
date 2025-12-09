"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { formatDate, formatTime } from "@/components/utils/time";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_start?: string | null;
  rest_end?: string | null;
  note?: string | null;
  status?: string; // pending / approved など
};

export default function AttendanceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`;
    console.log("🔗 Fetching:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setRecord(data))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Layout>
        <p className='text-center text-gray-600 py-16 text-lg'>
          データを読み込み中です...
        </p>
      </Layout>
    );

  if (!record)
    return (
      <Layout>
        <p className='text-center text-red-500 py-16 text-lg'>
          データが見つかりません。
        </p>
      </Layout>
    );

  return (
    <Layout>
      <div className='flex justify-center mt-12 mb-20'>
        <div className='w-full max-w-3xl bg-gray-50 shadow-lg rounded-xl p-10 border border-gray-200'>
          {/* タイトル */}
          <h2 className='text-2xl font-semibold mb-8 border-l-4 border-gray-600 pl-3'>
            勤務詳細
          </h2>

          {/* 内容テーブル風 */}
          <div className='space-y-5'>
            <div className='flex'>
              <p className='w-1/4 font-medium text-gray-700'>名前</p>
              <p className='w-3/4 bg-white border border-gray-200 rounded px-4 py-2'>
                {record.user_name}
              </p>
            </div>

            <div className='flex'>
              <p className='w-1/4 font-medium text-gray-700'>日付</p>
              <p className='w-3/4 bg-white border border-gray-200 rounded px-4 py-2'>
                {formatDate(record.date)}
              </p>
            </div>

            <div className='flex'>
              <p className='w-1/4 font-medium text-gray-700'>出勤・退勤</p>
              <p className='w-3/4 bg-white border border-gray-200 rounded px-4 py-2'>
                {record.clock_in_time
                  ? `${formatTime(record.clock_in_time)} ～ ${
                      record.clock_out_time
                        ? formatTime(record.clock_out_time)
                        : "―"
                    }`
                  : "―"}
              </p>
            </div>

            <div className='flex'>
              <p className='w-1/4 font-medium text-gray-700'>休憩</p>
              <p className='w-3/4 bg-white border border-gray-200 rounded px-4 py-2'>
                {record.rest_start && record.rest_end
                  ? `${formatTime(record.rest_start)} ～ ${formatTime(
                      record.rest_end
                    )}`
                  : "―"}
              </p>
            </div>

            <div className='flex'>
              <p className='w-1/4 font-medium text-gray-700'>備考</p>
              <p className='w-3/4 bg-white border border-gray-200 rounded px-4 py-2'>
                {record.note || "（備考なし）"}
              </p>
            </div>
          </div>

          {/* ステータス（承認待ち等） */}
          {record.status === "pending" && (
            <p className='mt-8 text-sm text-red-500 text-right font-medium'>
              ※ 承認待ちのため修正はできません。
            </p>
          )}

          {/* 戻るボタン */}
          <div className='flex justify-center mt-12'>
            <button
              onClick={() => router.push("/attendances")}
              className='bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md shadow-md transition'
            >
              一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
