"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/app/(user)/Layout";
import { formatDate, formatTime } from "@/components/utils/time";

type Rest = {
  break_start: string;
  break_end: string;
};

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rests: Rest[];   // ← ★ここ
  // rest_end?: string | null;
  note?: string | null;
  status?: string;
};

// "HH:MM:SS" or "YYYY-MM-DD HH:MM:SS" → "HH:MM" に変換
function toTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  const parts = value.trim().split(" ");
  const timePart = parts.length === 2 ? parts[1] : parts[0];
  return timePart.slice(0, 5);
}

export default function AttendanceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    clock_in_time: "",
    clock_out_time: "",
    rests: [] as Rest[],
    note: "",
  });

  const handleRestChange = (
    index: number,
    field: "break_start" | "break_end",
    value: string
  ) => {
    const newRests = [...form.rests];
    newRests[index][field] = value;
    setForm({ ...form, rests: newRests });
  };

  const addRest = () => {
    setForm({
      ...form,
      rests: [...form.rests, { break_start: "", break_end: "" }],
    });
  };

  const removeRest = (index: number) => {
    const newRests = form.rests.filter((_, i) => i !== index);
    setForm({ ...form, rests: newRests });
  };

  // データ取得（credentials: "include" でSanctumセッションCookieを送る）
  useEffect(() => {
    if (!id) return;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`;
    fetch(apiUrl, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data: Attendance) => {
        setRecord(data);
        setForm({
          clock_in_time: toTimeInput(data.clock_in_time),
          clock_out_time: toTimeInput(data.clock_out_time),
          rests:
            data.rests?.map((r) => ({
              break_start: toTimeInput(r.break_start),
              break_end: toTimeInput(r.break_end),
            })) ?? [],    
          note: data.note ?? "",
        });
      })

      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 更新処理
  const handleSubmit = async () => {
    if (!record) return;

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // ① CSRF Cookie取得
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`,
        { credentials: "include" }
      );

      // ② CookieからXSRF取得 ← ★復活
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const decodedToken = xsrfToken
        ? decodeURIComponent(xsrfToken)
        : "";

      // ③ PUT
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": decodedToken, // ← ★これ絶対必要
          },

          body: JSON.stringify({
            clock_in_time: form.clock_in_time,
            clock_out_time: form.clock_out_time,
            // rests: form.rests,
            rests: form.rests.filter(
              (r) => r.break_start && r.break_end
            ),
            note: form.note || null,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`HTTP Error: ${res.status}`);
      }

      // ④ 再取得
      const refreshed = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`,
        { credentials: "include" }
      ).then((r) => r.json());

      // ⑤ state更新
      setRecord(refreshed);
      setForm({
        clock_in_time: toTimeInput(refreshed.clock_in_time),
        clock_out_time: toTimeInput(refreshed.clock_out_time),
        rests:
          refreshed.rests?.map((r: any) => ({
            break_start: toTimeInput(r.break_start),
            break_end: toTimeInput(r.break_end),
          })) ?? [],
        note: refreshed.note ?? "",
      });

      setSuccessMsg("勤務情報を更新しました。");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("更新に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!record) return;
    setForm({
      clock_in_time: toTimeInput(record.clock_in_time),
      clock_out_time: toTimeInput(record.clock_out_time),
      rests: data.rests?.map((r) => ({
        break_start: toTimeInput(r.break_start),
        break_end: toTimeInput(r.break_end),
      })) ?? [],
      // rest_start: toTimeInput(record.rest_start),
      // rest_end: toTimeInput(record.rest_end),
      note: record.note ?? "",
    });
    setErrorMsg("");
    setIsEditing(false);
  };

  const isPending = record?.status === "pending";

  if (loading)
    return (
      <Layout>
        <p className="text-center text-gray-600 py-16 text-lg">
          データを読み込み中です...
        </p>
      </Layout>
    );

  if (!record)
    return (
      <Layout>
        <p className="text-center text-red-500 py-16 text-lg">
          データが見つかりません。
        </p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-center mt-12 mb-20">
        <div className="w-full max-w-3xl bg-gray-50 shadow-lg rounded-xl p-10 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-8 border-l-4 border-gray-600 pl-3">
            勤務詳細
          </h2>

          {successMsg && (
            <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded px-4 py-2">
              ✅ {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">
              ❌ {errorMsg}
            </p>
          )}

          {isPending && (
            <p className="mb-6 text-sm text-red-500 font-medium">
              ※ 承認待ちのため修正はできません。
            </p>
          )}

          <div className="space-y-5">
            {/* 名前（編集不可） */}
            <div className="flex">
              <p className="w-1/4 font-medium text-gray-700">名前</p>
              <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                {record.user_name}
              </p>
            </div>

            {/* 日付（編集不可） */}
            <div className="flex">
              <p className="w-1/4 font-medium text-gray-700">日付</p>
              <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                {formatDate(record.date)}
              </p>
            </div>

            {/* 出勤・退勤 */}
            <div className="flex items-center">
              <p className="w-1/4 font-medium text-gray-700">出勤・退勤</p>
              {isEditing ? (
                <div className="w-3/4 flex items-center gap-2">
                  <input
                    type="time"
                    name="clock_in_time"
                    value={form.clock_in_time}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <span className="text-gray-500">～</span>
                  <input
                    type="time"
                    name="clock_out_time"
                    value={form.clock_out_time}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              ) : (
                <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                  {record.clock_in_time
                    ? `${formatTime(record.clock_in_time)} ～ ${record.clock_out_time
                      ? formatTime(record.clock_out_time)
                      : "―"
                    }`
                    : "―"}
                </p>
              )}
            </div>

            {/* 休憩 */}
            <div className="space-y-3">
              {(record?.rests ?? []).length > 0 ? (
                (record?.rests ?? []).map((rest, index) => (
                  <div key={index} className="flex items-center">

                    {/* ラベル */}
                    <p className="w-1/4 font-medium text-gray-700">
                      {index === 0 ? "休憩" : `休憩${index + 1}`}
                    </p>

                    {/* 値（枠あり） */}
                    <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                      {formatTime(rest.break_start)} ～ {formatTime(rest.break_end)}
                    </p>

                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <p className="w-1/4 font-medium text-gray-700">休憩</p>
                  <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                    ーー ～ ーー
                  </p>
                </div>
              )}
             </div>

            {/* /* <div className="mb-3"> */}
              {/* <label>休憩</label>

              {isEditing ? (
                <div>
                  {form.rests.map((rest, index) => (
                    <div key={index} className="flex gap-2 mb-2">

                      <span>
                        {index === 0 ? "休憩" : `休憩${index + 1}`}
                      </span>

                      <input
                        type="time"
                        value={rest.break_start}
                        onChange={(e) =>
                          handleRestChange(index, "break_start", e.target.value)
                        }
                      />
                      〜
                      <input
                        type="time"
                        value={rest.break_end}
                        onChange={(e) =>
                          handleRestChange(index, "break_end", e.target.value)
                        }
                      />
                      <button onClick={() => removeRest(index)}>✕</button>

                    </div>
                  ))}
                  <button onClick={addRest}>＋休憩追加</button>
                </div>
              ) : (
                
                  {(record?.rests ?? []).map((rest, index) => (
                    <div key={index}>
                      {index === 0 ? "休憩" : `休憩${index + 1}`}：
                      {rest.break_start} 〜 {rest.break_end}
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* 備考 */}
            <div className="flex items-start">
              <p className="w-1/4 font-medium text-gray-700 pt-2">備考</p>
              {isEditing ? (
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="備考を入力..."
                  className="w-3/4 bg-white border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              ) : (
                <p className="w-3/4 bg-white border border-gray-200 rounded px-4 py-2">
                  {record.note || "（備考なし）"}
                </p>
              )}
            </div>
          </div> 

          {/* ボタン群 */}
          <div className="flex justify-center gap-4 mt-12">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-md shadow-sm transition disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md shadow-md transition disabled:opacity-50"
                >
                  {saving ? "更新中..." : "更新する"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/attendances")}
                  className="bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-md shadow-sm transition"
                >
                  一覧に戻る
                </button>
                {!isPending && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md shadow-md transition"
                  >
                    修正する
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

