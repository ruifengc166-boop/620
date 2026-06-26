"use client";
import { useState, useCallback } from "react";

// 体裁选项
const genreOptions = [
  { value: "activity_plan", label: "活动方案", icon: "📋" },
  { value: "host_script", label: "主持词", icon: "🎤" },
  { value: "news_release", label: "新闻稿", icon: "📰" },
  { value: "official_account", label: "公众号推文", icon: "💬" },
  { value: "activity_notice", label: "活动通知", icon: "📢" },
  { value: "activity_summary", label: "活动总结", icon: "📝" },
  { value: "leadership_speech", label: "领导致辞", icon: "🎯" },
  { value: "work_briefing", label: "工作简报", icon: "📄" },
  { value: "short_video_script", label: "短视频脚本", icon: "🎬" },
  { value: "invitation", label: "邀请函", icon: "✉️" },
];

// 文风选项
const styleOptions = [
  { value: "official", label: "正式公文风", icon: "🏛️" },
  { value: "concise", label: "简洁实用风", icon: "✂️" },
  { value: "lively", label: "活泼新媒体风", icon: "✨" },
  { value: "warm", label: "亲切温暖风", icon: "🤗" },
  { value: "inspiring", label: "鼓舞振奋风", icon: "🔥" },
  { value: "documentary", label: "纪实事理风", icon: "📐" },
];

// 推荐搜索词
const hotKeywords = [
  "社区活动", "党建活动", "招商推介", "文化节", "志愿服务",
  "座谈会", "培训会", "年终总结", "表彰大会", "新闻发布会",
];

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  tags: string[];
}

export default function MaterialSearch() {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const doSearch = useCallback(async (page: number = 1) => {
    if (!selectedGenre && !selectedStyle && !keyword.trim()) {
      setError("请至少选择一个体裁、文风或输入关键词");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/search-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre: selectedGenre || undefined,
          style: selectedStyle || undefined,
          keyword: keyword.trim() || undefined,
          page,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (page === 1) {
          setResults(data.results);
        } else {
          setResults((prev) => [...prev, ...data.results]);
        }
        setHasMore(data.results.length >= 10);
        setCurrentPage(page);
      } else {
        setError(data.error || "搜索失败，请重试");
        setResults([]);
      }
    } catch {
      setError("网络请求失败，请检查网络后重试");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, selectedStyle, keyword]);

  const handleGenreClick = (value: string) => {
    setSelectedGenre((prev) => (prev === value ? "" : value));
  };

  const handleStyleClick = (value: string) => {
    setSelectedStyle((prev) => (prev === value ? "" : value));
  };

  const handleHotKeyword = (kw: string) => {
    setKeyword(kw);
  };

  const handleReset = () => {
    setSelectedGenre("");
    setSelectedStyle("");
    setKeyword("");
    setResults([]);
    setSearched(false);
    setError("");
  };

  return (
    <section className="bg-white border-t border-[#e2e8f0] py-8">
      <div className="container-app">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-[#1e293b] mb-2">
            🔍 全网范文搜索
          </h2>
          <p className="text-sm text-[#64748b]">
            按体裁、文风搜索全网优质范文和写作参考，找到你需要的材料模板
          </p>
        </div>

        {/* 搜索区域 */}
        <div className="bg-[#f8fafc] rounded-2xl p-4 md:p-6 border border-[#e2e8f0]">
          {/* 体裁选择 */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-[#475569] mb-2">📝 选择体裁</div>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleGenreClick(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedGenre === opt.value
                      ? "bg-[#1a56db] text-white border-[#1a56db] shadow-sm"
                      : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#3b82f6] hover:text-[#1a56db]"
                  }`}
                >
                  <span className="mr-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 文风选择 */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-[#475569] mb-2">🎨 选择文风</div>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStyleClick(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedStyle === opt.value
                      ? "bg-[#059669] text-white border-[#059669] shadow-sm"
                      : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#059669] hover:text-[#059669]"
                  }`}
                >
                  <span className="mr-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 关键词输入 */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-[#475569] mb-2">🔑 关键词（可选）</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") doSearch(1);
                }}
                placeholder="如：社区反诈宣传、招商推介会、党建座谈会..."
                className="form-input flex-1"
              />
              <button
                onClick={() => doSearch(1)}
                disabled={loading}
                className="btn-primary whitespace-nowrap"
              >
                {loading ? "搜索中..." : "🔍 搜索"}
              </button>
              {(selectedGenre || selectedStyle || keyword) && (
                <button
                  onClick={handleReset}
                  className="btn-secondary whitespace-nowrap"
                >
                  清空
                </button>
              )}
            </div>
          </div>

          {/* 热门搜索词 */}
          {!searched && (
            <div>
              <div className="text-xs font-semibold text-[#475569] mb-2">🔥 热门搜索</div>
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleHotKeyword(kw)}
                    className="px-2.5 py-1 rounded-md text-xs text-[#64748b] bg-white border border-[#e2e8f0] hover:border-[#3b82f6] hover:text-[#1a56db] transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-center">
            <p className="text-sm text-[#991b1b]">{error}</p>
          </div>
        )}

        {/* 加载状态 */}
        {loading && results.length === 0 && (
          <div className="mt-6 flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-3 border-[#e2e8f0] border-t-[#1a56db] rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-[#64748b]">正在全网搜索中...</p>
          </div>
        )}

        {/* 搜索结果 */}
        {results.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748b]">
                找到 <span className="font-semibold text-[#1e293b]">{results.length}</span> 条相关结果
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-[#1a56db] hover:text-[#1e40af] font-medium"
              >
                重新搜索
              </button>
            </div>

            {/* 卡片墙 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 hover:border-[#3b82f6] hover:shadow-md transition-all group"
                >
                  {/* 标题 */}
                  <h3 className="font-semibold text-sm text-[#1e293b] group-hover:text-[#1a56db] transition-colors line-clamp-2 mb-2">
                    {result.title}
                  </h3>

                  {/* 摘要 */}
                  <p className="text-xs text-[#64748b] line-clamp-3 mb-3 leading-relaxed">
                    {result.snippet || "点击查看详细内容"}
                  </p>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className={`tag ${
                            i === 0 ? "tag-blue" : i === 1 ? "tag-green" : "tag-gray"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[0.65rem] text-[#94a3b8] flex items-center gap-0.5 shrink-0 ml-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {result.source}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* 加载更多 */}
            {hasMore && !loading && (
              <div className="text-center mt-6">
                <button
                  onClick={() => doSearch(currentPage + 1)}
                  className="btn-secondary"
                >
                  加载更多结果
                </button>
              </div>
            )}

            {loading && results.length > 0 && (
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 text-sm text-[#64748b]">
                  <div className="w-4 h-4 border-2 border-[#e2e8f0] border-t-[#1a56db] rounded-full animate-spin"></div>
                  加载中...
                </div>
              </div>
            )}
          </div>
        )}

        {/* 空状态 */}
        {searched && !loading && results.length === 0 && !error && (
          <div className="mt-6 text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm text-[#64748b]">未找到相关结果，试试更换关键词或体裁</p>
          </div>
        )}

        {/* 引导提示 */}
        {!searched && (
          <div className="mt-6 bg-gradient-to-r from-[#eff6ff] to-[#f0fdf4] rounded-xl p-4 text-center">
            <p className="text-sm text-[#475569]">
              💡 找到合适的范文参考后，可以使用
              <a href="/quick-write" className="text-[#1a56db] font-semibold mx-1 hover:underline">快速写材料</a>
              功能，AI 帮你一键生成初稿
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
