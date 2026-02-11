"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Detail = {
  id: number;
  user_name: string;
  target_date: string;
  reason: string;

  after_clock_in: string | null;
  after_clock_out: string | null;
  after_break_start: string | null;
  after_break_end: string | null;
};

export default function AdminCorrectionDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/correction/${id}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .catch((err) => console.error("API Error:", err));
  }, [id]);

  if (!detail)
    return (
      <div className='text-center text-gray-600 py-20 text-lg'>読み込み中…</div>
    );

  return (
    <div className='max-w-3xl mx-auto bg-white p-10 shadow rounded'>
      <h2 className='text-2xl font-bold mb-8'>勤務詳細</h2>

      {/* 名前 */}
      <div className='space-y-6'>
        <div className='flex justify-between border-b pb-2'>
          <span className='font-semibold'>名前</span>
          <span>{detail.user_name}</span>
        </div>

        {/* 日付 */}
        <div className='flex justify-between border-b pb-2'>
          <span className='font-semibold'>日付</span>
          <span>{detail.target_date}</span>
        </div>

        {/* 出勤・退勤（修正後） */}
        <div className='flex justify-between border-b pb-2'>
          <span className='font-semibold'>出勤・退勤</span>
          <span>
            {detail.after_clock_in ?? "―"} ～ {detail.after_clock_out ?? "―"}
          </span>
        </div>

        {/* 休憩（修正後） */}
        <div className='flex justify-between border-b pb-2'>
          <span className='font-semibold'>休憩</span>
          <span>
            {detail.after_break_start ?? "―"} ～ {detail.after_break_end ?? "―"}
          </span>
        </div>

        {/* 備考 */}
        <div className='flex justify-between border-b pb-2'>
          <span className='font-semibold'>備考（修正理由）</span>
          <span>{detail.reason}</span>
        </div>
      </div>

      <div className='text-right mt-10'>
        <button className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800'>
          承認する
        </button>
      </div>
    </div>
  );
}
