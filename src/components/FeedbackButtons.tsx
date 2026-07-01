"use client";
import { useState } from "react";

type Rating = "good" | "ok" | "bad";
const ratingLabels: Record<Rating, string> = { good: "好用", ok: "一般", bad: "不好用" };
const reasons = ["结构不对", "语言太空", "不够正式", "不够有传播感", "细节太少", "有编造内容", "格式不好复制", "其他"];

export default function FeedbackButtons({ materialType, resultId }: { materialType: string; resultId?: string }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (nextRating: Rating, nextReasons = selectedReasons) => {
    setSubmitting(true); setMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: nextRating, reasons: nextReasons, comment, material_type: materialType, result_id: resultId || "" }),
      });
      const data = await res.json();
      setMsg(data.msg || (data.ok ? "已收到反馈" : "反馈提交失败"));
    } catch {
      setMsg("反馈提交失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReason = (r: string) => {
    setSelectedReasons(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r].slice(0, 5));
  };

  return (
    <div className="mt-3 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#64748b]">这份材料质量如何？</span>
        {(["good", "ok", "bad"] as Rating[]).map(r => (
          <button key={r} disabled={submitting} onClick={() => { setRating(r); if (r === "good") submit(r, []); }} className={"px-2.5 py-1 rounded-full border text-[0.65rem] transition-colors " + (rating === r ? "bg-[#eff6ff] border-[#93c5fd] text-[#1d4ed8]" : "bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]")}>{ratingLabels[r]}</button>
        ))}
      </div>
      {rating && rating !== "good" && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {reasons.map(r => <button key={r} type="button" onClick={() => toggleReason(r)} className={"px-2 py-1 rounded border text-[0.6rem] " + (selectedReasons.includes(r) ? "bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]" : "bg-white border-[#e2e8f0] text-[#64748b]")}>{r}</button>)}
          </div>
          <textarea className="form-input min-h-[60px] text-xs" placeholder="可补充一句具体问题，便于我们优化 Prompt（选填）" value={comment} onChange={e => setComment(e.target.value)} />
          <button disabled={submitting} onClick={() => submit(rating)} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-60">提交反馈</button>
        </div>
      )}
      {msg && <p className="mt-2 text-[0.65rem] text-[#059669]">{msg}</p>}
    </div>
  );
}
