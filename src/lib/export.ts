export function exportWord(title: string, content: string): void {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:"SimSun","宋体",serif;font-size:12pt;line-height:1.8;padding:40px;color:#000}h1{text-align:center;font-size:18pt;margin-bottom:20px;font-weight:bold}h2{font-size:15pt;margin-top:18px;font-weight:bold}h3{font-size:13pt;margin-top:14px;font-weight:bold}p{text-indent:2em;margin:6px 0}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #333;padding:6px 10px;font-size:11pt}th{background:#f0f0f0;font-weight:bold}@page{margin:2.54cm}.footer{text-align:center;font-size:9pt;color:#999;margin-top:30px;border-top:1px solid #ddd;padding-top:8px}</style></head>
<body>
<h1>${title}</h1>
<div>${content.replace(/\n/g, "<br/>")}</div>
<div class="footer"><p>AI初稿，仅供参考 | 办会工坊生成</p></div>
</body></html>`;
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(title: string): void {
  window.print();
}

export function exportExcel(title: string, rows: string[][]): void {
  let csv = "\uFEFF";
  rows.forEach(row => {
    csv += row.map(cell => `"${cell.replace(/"/g, "\"\"")}"`).join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportMaterialPackage(title: string, materials: { name: string; content: string }[]): void {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:"SimSun",serif;font-size:12pt;line-height:1.8;padding:40px}
h1{text-align:center;font-size:18pt}h2{font-size:15pt;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px}
p{text-indent:2em;margin:6px 0}.footer{text-align:center;font-size:9pt;color:#999;margin-top:30px}
@page{margin:2.54cm}</style></head><body>
<h1>${title}</h1>
${materials.map(m => `<h2>${m.name}</h2><div>${m.content.replace(/\n/g, "<br/>")}</div>`).join("")}
<div class="footer"><p>AI初稿，仅供参考 | 办会工坊生成</p></div>
</body></html>`;
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
