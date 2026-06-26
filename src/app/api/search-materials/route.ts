import { NextRequest, NextResponse } from "next/server";

// 体裁分类定义
const genreMap: Record<string, { query: string; label: string }> = {
  activity_plan: { query: "活动方案 范文 模板", label: "活动方案" },
  host_script: { query: "主持词 主持稿 范文", label: "主持词" },
  news_release: { query: "新闻稿 新闻通稿 范文", label: "新闻稿" },
  official_account: { query: "公众号推文 范文 案例", label: "公众号推文" },
  activity_notice: { query: "活动通知 通知范文 公文", label: "活动通知" },
  activity_summary: { query: "活动总结 工作总结 范文", label: "活动总结" },
  leadership_speech: { query: "领导致辞 讲话稿 发言稿 范文", label: "领导致辞" },
  work_briefing: { query: "工作简报 简报范文", label: "工作简报" },
  short_video_script: { query: "短视频脚本 口播文案 案例", label: "短视频脚本" },
  invitation: { query: "邀请函 范文 模板", label: "邀请函" },
  process_table: { query: "活动流程表 会议流程 范文", label: "流程表" },
  task_assignment: { query: "任务分工表 工作分工 范文", label: "任务分工表" },
};

// 文风分类定义
const styleMap: Record<string, { query: string; label: string }> = {
  official: { query: "正式 公文 规范", label: "正式公文风" },
  concise: { query: "简洁 实用 精炼", label: "简洁实用风" },
  lively: { query: "活泼 生动 新媒体", label: "活泼新媒体风" },
  warm: { query: "亲切 温暖 走心", label: "亲切温暖风" },
  inspiring: { query: "鼓舞 振奋 激励", label: "鼓舞振奋风" },
  documentary: { query: "纪实 客观 报道", label: "纪实事理风" },
};

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  tags: string[];
}

// 从 Bing 搜索结果 HTML 中提取链接和内容
function parseBingResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];

  // 提取搜索结果块
  const resultBlocks: string[] = [];
  const liRegex = /<li class="b_algo"[^>]*>([\s\S]*?)<\/li>/g;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    resultBlocks.push(match[1]);
  }

  for (const block of resultBlocks) {
    // 提取标题和链接
    const titleMatch = block.match(/<h2[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
    if (!titleMatch) continue;

    const url = titleMatch[1];
    const titleRaw = titleMatch[2].replace(/<[^>]+>/g, "").trim();
    if (!titleRaw || !url) continue;

    // 跳过 Bing 内部链接
    if (url.includes("bing.com") || url.includes("msn.com")) continue;

    // 提取摘要
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    let snippet = "";
    if (snippetMatch) {
      snippet = snippetMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    // 提取来源域名
    let source = "";
    try {
      const urlObj = new URL(url);
      source = urlObj.hostname.replace(/^www\./, "");
    } catch {
      source = url.substring(0, 40);
    }

    results.push({
      title: titleRaw,
      url,
      snippet: snippet.substring(0, 300),
      source,
      tags: [],
    });

    if (results.length >= 12) break;
  }

  return results;
}

// 从百度搜索结果 HTML 中提取内容（备用）
function parseBaiduResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];

  // 百度搜索结果块
  const blockRegex = /<div class="result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
    if (!titleMatch) continue;

    const url = titleMatch[1];
    const titleRaw = titleMatch[2].replace(/<[^>]+>/g, "").trim();
    if (!titleRaw) continue;

    const snippetMatch = block.match(/<span class="content-right_[^"]*"[^>]*>([\s\S]*?)<\/span>/);
    let snippet = "";
    if (snippetMatch) {
      snippet = snippetMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    results.push({
      title: titleRaw,
      url: url.startsWith("http") ? url : `https://www.baidu.com${url}`,
      snippet: snippet.substring(0, 300),
      source: "baidu.com",
      tags: [],
    });

    if (results.length >= 12) break;
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { genre, style, keyword, page = 1 } = body;

    // 构建搜索关键词
    const parts: string[] = [];

    if (keyword && keyword.trim()) {
      parts.push(keyword.trim());
    }

    if (genre && genreMap[genre]) {
      parts.push(genreMap[genre].query);
    }

    if (style && styleMap[style]) {
      parts.push(styleMap[style].query);
    }

    // 如果没有任何参数，使用默认关键词
    if (parts.length === 0) {
      parts.push("活动材料 范文 模板 写作技巧");
    }

    const searchQuery = parts.join(" ");
    const genreLabel = genre ? genreMap[genre]?.label || "" : "";
    const styleLabel = style ? styleMap[style]?.label || "" : "";

    // 标签
    const tags: string[] = [];
    if (genreLabel) tags.push(genreLabel);
    if (styleLabel) tags.push(styleLabel);
    if (keyword) tags.push(keyword.trim());

    // 使用 Bing 搜索
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}&first=${(page - 1) * 10 + 1}&count=10&setlang=zh-CN`;

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
    };

    let results: SearchResult[] = [];

    try {
      const response = await fetch(bingUrl, {
        headers,
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const html = await response.text();
        results = parseBingResults(html);

        // 如果 Bing 结果不够，尝试百度
        if (results.length < 5) {
          try {
            const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}&pn=${(page - 1) * 10}`;
            const baiduResponse = await fetch(baiduUrl, {
              headers,
              signal: AbortSignal.timeout(10000),
            });
            if (baiduResponse.ok) {
              const baiduHtml = await baiduResponse.text();
              const baiduResults = parseBaiduResults(baiduHtml);
              results = [...results, ...baiduResults];
            }
          } catch {
            // 百度搜索失败，忽略
          }
        }
      }
    } catch {
      // Bing 搜索失败，尝试百度
      try {
        const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}&pn=${(page - 1) * 10}`;
        const baiduResponse = await fetch(baiduUrl, {
          headers,
          signal: AbortSignal.timeout(10000),
        });
        if (baiduResponse.ok) {
          const baiduHtml = await baiduResponse.text();
          results = parseBaiduResults(baiduHtml);
        }
      } catch {
        // 两个搜索引擎都失败
      }
    }

    // 为每个结果添加标签
    results = results.map((r) => ({
      ...r,
      tags: [...tags, r.source],
    }));

    // 去重
    const seen = new Set<string>();
    results = results.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    return NextResponse.json({
      success: true,
      query: searchQuery,
      genreLabel,
      styleLabel,
      results: results.slice(0, 12),
      total: results.length,
      page,
    });
  } catch (error) {
    console.error("Search materials error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "搜索服务暂时不可用，请稍后重试",
        results: [],
      },
      { status: 500 }
    );
  }
}
