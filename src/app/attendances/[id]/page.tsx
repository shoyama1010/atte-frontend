"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { formatTimeForInput } from "@/components/utils/time";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_start: string | null;
  rest_end: string | null;
  note: string | null;
  status: string; // pending / approved
};

export default function AttendanceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);

  // フォーム state
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [restStart, setRestStart] = useState("");
  const [restEnd, setRestEnd] = useState("");
  const [note, setNote] = useState("");

  // データ取得
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
        setClockIn(formatTimeForInput(data.clock_in_time));
        setClockOut(formatTimeForInput(data.clock_out_time));
        setRestStart(formatTimeForInput(data.rest_start));
        setRestEnd(formatTimeForInput(data.rest_end));
        setNote(data.note ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-center">読み込み中...</p>
      </Layout>
    );
  }

  if (!record) {
    return (
      <Layout>
        <p className="text-center text-red-500">データが見つかりません。</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">勤務詳細</h2>

      {/* 上部メッセージ（承認待ち）
      {record.status === "pending" && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-6 text-center font-semibold">
          承認待ちのため修正はできません。
        </div>
      )} */}

      <div className="bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto">

        {/* 基本情報 */}
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="py-2 font-bold w-32">名前</td>
              <td className="py-2">{record.user_name}</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">日付</td>
              <td className="py-2">{record.date}</td>
            </tr>
          </tbody>
        </table>

        {/* フォーム入力（承認待ちなら disabled） */}
        <div className="space-y-6">
          <div>
            <label className="font-bold">出勤・退勤</label>
            <div className="flex gap-3 mt-2">
              <input
                type="time"
                value={clockIn}
                disabled
                className="border p-2 rounded w-32"
              />
              <span>〜</span>
              <input
                type="time"
                value={clockOut}
                disabled
                className="border p-2 rounded w-32"
              />
            </div>
          </div>

          <div>
            <label className="font-bold">休憩</label>
            <div className="flex gap-3 mt-2">
              <input
                type="time"
                value={restStart}
                disabled
                className="border p-2 rounded w-32"
              />
              <span>〜</span>
              <input
                type="time"
                value={restEnd}
                disabled
                className="border p-2 rounded w-32"
              />
            </div>
          </div>

          <div>
            <label className="font-bold">備考（修正理由など）</label>
            <textarea
              value={note}
              disabled
              className="border p-2 rounded w-full h-24"
            />
          </div>
        </div>

        {/* 下部にも注意メッセージ */}
        {record.status === "pending" && (
          <div className="mt-6 bg-yellow-100 text-yellow-800 p-3 rounded text-center font-semibold">
            承認待ちのため修正はできません。
          </div>
        )}

        {/* 戻るボタンのみ */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/attendances")}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            一覧に戻る
          </button>
        </div>

      </div>
    </Layout>
  );
}
