"use client";
interface Props {
  formData: Record<string, string>;
  onClear: () => void;
}

export default function SessionMaterials({ formData, onClear }: Props) {
  const entries = Object.entries(formData).filter(([, v]) => v?.trim());
  if (entries.length === 0) return null;

  return (
    <div className="card p-4 mb-4 border-[#fde68a] bg-[#fffbeb]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[#92400e] flex items-center gap-1">
          📦 本次活动素材区
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-[#92400e] hover:text-[#dc2626] underline"
        >
          一键清空
        </button>
      </div>
      <p className="text-[0.6rem] text-[#a16207] mb-2">
        素材仅用于当前任务，关闭页面或24小时后自动清空。请勿上传涉密、内部、隐私内容。
      </p>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([key, val]) => (
          <span key={key} className="tag tag-yellow text-[0.55rem] max-w-[200px] truncate" title={val}>
            {key.replace(/_/g, "")}: {val.slice(0, 30)}{val.length > 30 ? ".." : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
