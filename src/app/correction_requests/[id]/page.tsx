// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function CorrectionRequestDetailPage() {
//   const { id } = useParams();
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}`)
//       .then((res) => res.json())
//       .then((json) => setData(json));
//   }, [id]);

//   if (!data) return <p className="text-center mt-10">読み込み中...</p>;

//   return (
//     <div className="p-10">
//       <h2 className="text-2xl font-bold mb-6">申請詳細</h2>

//       <div className="border p-5 rounded bg-white w-[600px]">
//         <p>申請者：{data.user_name}</p>
//         <p>申請日時：{data.created_at}</p>
//         <p>対象日：{data.target_date}</p>
//         <p>理由：{data.reason}</p>

//         <h3 className="mt-5 font-bold">変更内容</h3>
//         <p>出勤：{data.before_clock_in} → {data.after_clock_in}</p>
//         <p>退勤：{data.before_clock_out} → {data.after_clock_out}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";

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

export default function CorrectionRequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<CorrectionRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  //   データ取得
  // -----------------------------
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("API ERROR:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout>読み込み中...</Layout>;
  if (!data) return <Layout>データが取得できませんでした。</Layout>;

  // -----------------------------
  //   承認処理
  // -----------------------------
  const handleApprove = async () => {
    if (!confirm("この申請を承認しますか？")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}/approve`,
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
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-10">勤務詳細</h2>

      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto p-8">
        {/* 名前 */}
        <div className="border-b py-4 flex">
          <div className="w-40 font-semibold">名前</div>
          <div>{data.user_name}</div>
        </div>

        {/* 日付 */}
        <div className="border-b py-4 flex">
          <div className="w-40 font-semibold">日付</div>
          <div>{data.target_date}</div>
        </div>

        {/* 出勤・退勤 */}
        <div className="border-b py-4 flex">
          <div className="w-40 font-semibold">出勤・退勤</div>
          <div>
            {data.after_clock_in} ～ {data.after_clock_out}
          </div>
        </div>

        {/* 休憩 */}
        <div className="border-b py-4 flex">
          <div className="w-40 font-semibold">休憩</div>
          <div>
            {data.after_break_start && data.after_break_end
              ? `${data.after_break_start} ～ ${data.after_break_end}`
              : "ー 〜 ー"}
          </div>
        </div>

        {/* 理由 */}
        <div className="border-b py-4 flex">
          <div className="w-40 font-semibold">備考（修正理由）</div>
          <div>{data.reason}</div>
        </div>

        {/* ボタン */}
        <div className="mt-8 text-center">
          {data.status === "pending" ? (
            <button
              onClick={handleApprove}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              承認する
            </button>
          ) : (
            <span className="text-green-600 font-semibold text-lg">
              承認済み
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 text-sm text-center">
        <a
          href="/correction_requests"
          className="text-blue-600 hover:underline"
        >
          ← 申請一覧に戻る
        </a>
      </div>
    </Layout>
  );
}

