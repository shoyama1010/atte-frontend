"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Rest = {
  break_start: string;
  break_end: string;
};

type Detail = {
  id: number;
  user_name: string;
  target_date: string;
  after_clock_in: string | null;
  after_clock_out: string | null;
  // rests: Rest[];
  after_break_start?: string | null;
  after_break_end?: string | null;
  reason?: string;
};

export default function AdminCorrectionDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [approved, setApproved] = useState(false);

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);

  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/corrections/${id}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      // .then((data) => setDetail(data))

      .then((data) => {
        console.log("API:", JSON.stringify(data, null, 2));
        setDetail(data);
      })  

      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // ⭐ ここが今回の本質
  const handleApprove = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/corrections/${id}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("承認APIエラー");
      // ✅ 画面を切り替える
      setApproved(true);

    } catch (e) {
      console.error(e);
      alert("承認に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !detail) {
    return (
      <div className="text-center text-gray-600 py-20 text-lg">
        読み込み中…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 shadow rounded">
      <h2 className="text-2xl font-bold mb-8">勤務詳細</h2>

      <div className="space-y-6">

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">名前</span>
          <span>{detail.user_name}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">日付</span>
          {/* <span>{detail.target_date}</span> */}
          <span>{detail.target_date?.replaceAll("-", "/")}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">出勤・退勤</span>
          <span>
            {formatTime(detail.after_clock_in)} ～ {formatTime(detail.after_clock_out)}
          </span>
        </div>

        {/* 休憩 */}
        {detail.rests && detail.rests.length > 0 ? (
          detail.rests.map((rest, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span className="font-semibold">
                {index === 0 ? "休憩" : `休憩${index + 1}`}
              </span>
              <span className="w-32 text-right">
                {/* {formatTime(rest.break_start)} ～ {formatTime(rest.break_end)} */}
                {formatTime(detail.after_break_start)} ～ {formatTime(detail.after_break_end)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">休憩</span>
            <span>ーー ～ ーー</span>
          </div>
        )}

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">備考（修正理由）</span>
          <span>{detail.reason}</span>
        </div>
      </div>

      {approved && (
        <p className="text-green-600 font-semibold mb-6 text-right">
          承認済
        </p>
      )}

      <div className="text-right mt-10">
        {approved ? (
          <button
            onClick={() => router.push("/admin/corrections/list")}
            className='bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600'
          >
            戻る
          </button>
        ) : (
          <button
            onClick={handleApprove}
            disabled={loading}
            className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800'
          >
            {loading ? "承認中..." : "承認する"}
            {/* 承認する */}
          </button>
        )}
      </div>
    </div>
  );
}