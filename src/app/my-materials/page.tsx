"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { loadSavedMaterials, deleteMaterial, clearAllMaterials, type SavedMaterial } from "@/lib/storage";
import { exportWord } from "@/lib/export";

export default function MyMaterialsPage() {
  const [materials, setMaterials] = useState<SavedMaterial[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMaterials(loadSavedMaterials());
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm("确定删除该材料？")) return;
    deleteMaterial(id);
    setMaterials(loadSavedMaterials());
    setMsg("已删除");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleClearAll = () => {
    if (!window.confirm("确定一键清空所有已保存材料？此操作不可撤销。")) return;
    clearAllMaterials();
    setMaterials([]);
    setMsg("已清空全部材料");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">📁 我的材料</h1>
          <p className="text-sm text-[#64748b] mt-1">您主动保存的最终成品（{materials.length}份）</p>
        </div>
        {materials.length > 0 && (
          <button onClick={handleClearAll} className="text-sm text-[#dc2626] hover:text-[#991b1b] underline">一键清空全部</button>
        )}
      </div>

      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#166534] text-center">{msg}</div>}

      <div className="security-banner mb-6 flex items-start gap-2">
        <span className="text-lg shrink-0">🔒</span>
        <div>
          <p className="text-xs font-medium">平台默认不自动保存您的原始输入和生成内容</p>
          <p className="text-xs mt-0.5">只有您主动点击"保存"的内容才会出现在这里。保存前系统会提示您确认内容不涉密。</p>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-lg font-semibold text-[#475569] mb-2">还没有保存的材料</h2>
          <p className="text-sm text-[#94a3b8] mb-4">生成材料后，点击"保存"按钮即可收藏在这里</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/quick-write" className="btn-primary">去写一个材料</a>
            <a href="/run-activity" className="btn-secondary">去办一场活动</a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map(mat => (
            <div key={mat.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-[#1e293b] truncate">{mat.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.6rem] text-[#64748b]">{mat.materialType}</span>
                    <span className="text-[0.55rem] text-[#94a3b8]">{new Date(mat.savedAt).toLocaleString("zh-CN")}</span>
                    <span className={"tag " + (mat.riskLevel === "low" ? "tag-green" : mat.riskLevel === "medium" ? "tag-yellow" : "tag-red")}>
                      {mat.riskLevel === "low" ? "低风险" : mat.riskLevel === "medium" ? "中风险" : "高风险"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  <button onClick={() => setSelectedId(selectedId === mat.id ? null : mat.id)} className={"btn-sm text-xs " + (selectedId === mat.id ? "btn-primary" : "btn-secondary")}>
                    {selectedId === mat.id ? "收起" : "预览"}
                  </button>
                  <button onClick={() => { exportWord(mat.title, mat.content); }} className="btn-sm text-xs btn-secondary">导出</button>
                  <button onClick={() => handleDelete(mat.id)} className="btn-sm text-xs text-[#dc2626] hover:underline">删除</button>
                </div>
              </div>
              {selectedId === mat.id && (
                <div className="mt-2 pt-2 border-t border-[#e2e8f0]">
                  <div className="max-h-[300px] overflow-y-auto slim-scrollbar text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">{mat.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
