"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";

// -----------------------------
// 型定義
// -----------------------------
type CorrectionRequestDetail = {
  id: number;
  user_name: string;
  request_date: string;
  target_date: string;
  before_clock_in: string | null;
  before_clock_out: string | null;
  before_break_start: string | null;
  before_break_end: string | null;
  after_clock_in: string | null;
  after_clock_out: string | null;
  after_break_start: string | null;
  after_break_end: string | null;
  reason: string;
  status: string; // pending, approved
};

// -----------------------------
// メインコンポーネント
// -----------------------------
export default function CorrectionRequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<CorrectionRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  //   データ取得処理
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}`;
    console.log("Fetching:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
        setError("データが取得できませんでした。");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // -----------------------------
  //   承認ボタン処理
  // -----------------------------
  const handleApprove = async () => {
    if (!confirm("この申請を承認しますか？")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/correction_requests/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        alert("承認しました");
        router.push("/correction_requests");
      } else {
        alert("承認に失敗しました");
      }
    } catch (err) {
      console.error("承認APIエラー:", err);
      alert("サーバー通信に失敗しました。");
    }
  };

  // -----------------------------
  //   ローディング or エラー表示
  // -----------------------------
  if (loading)
    return (
      <Layout>
        <p className='text-center text-gray-500 py-12 text-lg'>読み込み中...</p>
      </Layout>
    );

  if (error || !data)
    return (
      <Layout>
        <p className='text-center text-red-500 py-12 text-lg'>
          {error ?? "データが見つかりません。"}
        </p>
      </Layout>
    );

  // -----------------------------
  //   表示部分
  // -----------------------------
  return (
    <Layout>
      <h2 className='text-2xl font-bold mb-10 text-center'>修正申請詳細</h2>

      <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto p-8 border border-gray-200'>
        {/* 名前 */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold'>名前</div>
          <div>{data.user_name}</div>
        </div>

        {/* 対象日 */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold'>対象日</div>
          <div>{data.target_date}</div>
        </div>

        {/* 修正前（出勤・退勤） */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold text-gray-600'>
            修正前 出勤・退勤
          </div>
          <div>
            {data.before_clock_in ?? "―"} ～ {data.before_clock_out ?? "―"}
          </div>
        </div>

        {/* 修正後（出勤・退勤） */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold text-gray-600'>
            修正後 出勤・退勤
          </div>
          <div>
            {data.after_clock_in ?? "―"} ～ {data.after_clock_out ?? "―"}
          </div>
        </div>

        {/* 修正後（休憩） */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold text-gray-600'>修正後 休憩</div>
          <div>
            {data.after_break_start && data.after_break_end
              ? `${data.after_break_start} ～ ${data.after_break_end}`
              : "― ～ ―"}
          </div>
        </div>

        {/* 修正理由 */}
        <div className='border-b py-4 flex'>
          <div className='w-40 font-semibold'>備考（修正理由）</div>
          <div>{data.reason}</div>
        </div>

        {/* ステータス or ボタン */}
        <div className='mt-8 text-center'>
          {data.status === "pending" ? (
            <button
              onClick={handleApprove}
              className='bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700'
            >
              承認する
            </button>
          ) : (
            <span className='text-green-600 font-semibold text-lg'>
              承認済み
            </span>
          )}
        </div>
      </div>

      {/* 戻るリンク */}
      <div className='mt-8 text-sm text-center'>
        <Link
          href='/correction_requests'
          className='text-blue-600 hover:underline'
        >
          ← 申請一覧に戻る
        </Link>
      </div>
    </Layout>
  );
}
