"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/app/(user)/Layout";

type CorrectionDetail = {
  id: number;
  user_name: string;
  target_date: string;
  after_clock_in: string;
  after_clock_out: string;
  after_break_start: string | null;
  after_break_end: string | null;
  reason: string;
  status: string;
};

export default function CorrectionRequestDetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState<CorrectionDetail | null>(null);
  

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // 修正前の値は不要なので取り除く
        const cleaned = {
          id: data.id,
          user_name: data.user_name,
          target_date: data.target_date,
          after_clock_in: data.after_clock_in,
          after_clock_out: data.after_clock_out,
          after_break_start: data.after_break_start,
          after_break_end: data.after_break_end,
          reason: data.reason,
          status: data.status,
        };
        setDetail(cleaned);
      });
  }, [id]);

  if (!detail) return <Layout>読み込み中...</Layout>;
  // UI の間隔を詰めるための共通スタイル
  const rowClass = "flex justify-between items-center border-b pb-3 pt-3";
  const labelClass = "font-semibold w-32"; // 左項目の幅固定（間隔が開かない）
  const valueClass = "bg-gray-100 px-4 py-2 rounded w-64 text-center";

  return (
    <Layout>
      <div className='max-w-2xl mx-auto bg-white shadow p-8 rounded-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>修正申請詳細</h2>

        <div className='space-y-2'>
          <div className={rowClass}>
            <span className={labelClass}>名前</span>
            <span className={valueClass}>{detail.user_name}</span>
          </div>

          <div className={rowClass}>
            <span className={labelClass}>対象日</span>
            <span className={valueClass}>{detail.target_date}</span>
          </div>

          <div className={rowClass}>
            <span className={labelClass}>出勤・退勤</span>
            <span className={valueClass}>
              {detail.after_clock_in} ～ {detail.after_clock_out}
            </span>
          </div>

          <div className={rowClass}>
            <span className={labelClass}>休憩</span>
            <span className={valueClass}>
              {detail.after_break_start} ～ {detail.after_break_end}
            </span>
          </div>

          <div className={rowClass}>
            <span className={labelClass}>備考</span>
            <span className={valueClass}>{detail.reason}</span>
          </div>
        </div>

        {detail.status === "pending" && (
          <p className='text-center text-red-500 mt-6'>
            ※ 承認待ちのため修正はできません。
          </p>
        )}
      </div>
    </Layout>
  );
}
