"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type CorrectionDetail = {
  user_name: string;
  request_date: string;
  target_date: string;
  reason: string;

  before_clock_in: string | null;
  before_clock_out: string | null;
  before_break_start: string | null;
  before_break_end: string | null;

  after_clock_in: string | null;
  after_clock_out: string | null;
  after_break_start: string | null;
  after_break_end: string | null;
};

export default function AdminCorrectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [detail, setDetail] = useState<CorrectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost/api/admin/correction-requests/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDetail(data);
        setLoading(false);
      });
  }, [id]);

  // 承認 API用
  const handleApprove = async () => {
    const res = await fetch(
      `http://localhost/api/admin/correction-requests/${id}/approve`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.ok) {
      alert("承認しました！");
      router.push("/admin/corrections/list"); // 一覧へ戻る
    } else {
      alert("承認に失敗しました。");
    }
  };
  if (loading) return <div>読み込み中...</div>;
  if (!detail) return <div>データがありません</div>;

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10'>
      {/* タイトル */}
      <h2 className='text-2xl font-bold border-l-4 border-black pl-3 mb-8'>
        勤務詳細
      </h2>

      <table className='w-full text-left'>
        <tbody>
          <tr className='border-b'>
            <th className='py-4 w-40 text-gray-600'>名前</th>
            <td className='py-4'>{detail.user_name}</td>
          </tr>

          <tr className='border-b'>
            <th className='py-4 text-gray-600'>日付</th>
            <td className='py-4'>
              {detail.target_year}年　{detail.target_month}月{detail.target_day}
              日
            </td>
          </tr>

          <tr className='border-b'>
            <th className='py-4 text-gray-600'>出勤・退勤</th>
            <td className='py-4'>
              {detail.after_clock_in}　～　{detail.after_clock_out}
            </td>
          </tr>

          <tr className='border-b'>
            <th className='py-4 text-gray-600'>休憩</th>
            <td className='py-4'>
              {detail.after_break_start}　～　{detail.after_break_end}
            </td>
          </tr>

          <tr className='border-b'>
            <th className='py-4 text-gray-600'>備考</th>
            <td className='py-4'>{detail.reason}</td>
          </tr>
        </tbody>
      </table>

      {/* 承認ボタン */}
      <div className='mt-10 text-right'>
        <button
          onClick={handleApprove}
          className='px-8 py-3 bg-black text-white rounded hover:bg-gray-800'
        >
          承認する
        </button>
      </div>
    </div>

    // <div className="max-w-4xl mx-auto mt-10">
    //   <h1 className="text-xl font-bold mb-6">勤怠詳細</h1>

    //   <div className="border rounded-xl p-8 bg-white shadow-sm w-full">
    //     <table className="table-auto w-full border-collapse">
    //       <tbody>
    //         <tr><th className="border p-3 bg-gray-50">名前</th><td className="border p-3">{detail.user_name}</td></tr>
    //         <tr><th className="border p-3 bg-gray-50">日付</th><td className="border p-3">{detail.target_date}</td></tr>

    //         <tr><th className="border p-3 bg-gray-50">出勤・退勤（元の値）</th>
    //           <td className="border p-3">
    //             {detail.before_clock_in} ～ {detail.before_clock_out}
    //           </td>
    //         </tr>
    //         <tr><th className="border p-3 bg-gray-50">出勤・退勤（修正値）</th>
    //           <td className="border p-3">
    //             {detail.after_clock_in} ～ {detail.after_clock_out}
    //           </td>
    //         </tr>
    //         <tr><th className="border p-3 bg-gray-50">休憩（元の値）</th>
    //           <td className="border p-3">
    //             {detail.before_break_start} ～ {detail.before_break_end}
    //           </td>
    //         </tr>
    //         <tr><th className="border p-3 bg-gray-50">休憩（修正値）</th>
    //           <td className="border p-3">
    //             {detail.after_break_start} ～ {detail.after_break_end}
    //           </td>
    //         </tr>
    //         <tr><th className="border p-3 bg-gray-50">修正理由</th><td className="border p-3">{detail.reason}</td></tr>
    //       </tbody>
    //     </table>

    //     <div className="text-center mt-6">
    //       <button
    //       onClick={handleApprove} // 承認 API用・追加

    //         className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    //       >
    //         承認する
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}
