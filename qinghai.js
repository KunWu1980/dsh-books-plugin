/**
 * @local/books — Qinghai (青海省图书馆 · 地方史志) read-only adapter.
 *
 * Source: 青海文旅资源共享平台 (crrs.renrentong.cn/qhfz), hosted by 青海省图书馆.
 * Tech: ASP.NET WebForms + jQuery; anonymous JSON API + direct image links.
 *
 * Discovered endpoints (2026-11-28):
 *   GET /ajax/ajax_book_list.aspx?type=list&pageIndex=N&searchKey=...&EN=qhfz
 *       -> JSON array of book rows: {book_id, book_name, author, pub_house,
 *          pub_date, subjectClassify, mainPath, recordCount(first row) }
 *   GET /book/newsShow.aspx?EN=qhfz&book_id=<id>&ppage_num=<n>
 *       -> HTML listing every page image <img src=".../jpg/<id>/<page>_00.jpg">
 *   Images: <mainPath><book_id>/<page>_00.jpg   (page pattern: t00001_00.jpg, a00001_00.jpg ...)
 * bookInfo.aspx gives 页数/作者/出版时间 (parse as fallback).
 */
const BASE = "http://crrs.renrentong.cn";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DSH-Books/1.0";
const TIMEOUT = 20000;
const IMG_BASE = "https://img.wanjuan.cn/pic/crrs/books/qhfz/jpg/";
const IMG_BASE_ALT = "http://img.renrentong.cn/pic/crrs/books/qhfz/jpg/";
const PAGE_SIZE = 20;

const memory = { catalog: null, at: 0, pages: new Map() }; // pages: book_id -> [urls]

async function get(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json, text/html" },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!r.ok) throw new Error("HTTP " + r.status + " for " + url);
  const buf = Buffer.from(await r.arrayBuffer());
  return { buf, txt: buf.toString("utf8"), status: r.status, ct: r.headers.get("content-type") || "" };
}

function rowToBook(r) {
  return {
    sourceId: "qh:" + r.book_id,
    bookId: r.book_id,
    title: r.book_name || "",
    author: r.author || "",
    publishDate: r.pub_date || "",
    publisher: r.pub_house || "",
    classification: r.subjectClassify || "",
    pageCount: null, // filled by meta
  };
}

async function catalogRows(pageIndex, searchKey) {
  const u = BASE + "/ajax/ajax_book_list.aspx?t=&type=list&pageIndex=" + pageIndex
    + "&searchKey=" + encodeURIComponent(searchKey || "")
    + "&pub_house=&substation=&subjectClassify=&special_id=&area=&LibName=&nokey=&pub_house_s=&pub_s_date=&pub_e_date=&EN=qhfz";
  const { txt } = await get(u);
  let j;
  try { j = JSON.parse(txt); } catch (e) { throw new Error("bad catalog JSON: " + e.message); }
  if (!Array.isArray(j)) throw new Error("catalog not an array");
  return j;
}

async function pageUrls(bookId) {
  if (memory.pages.has(bookId)) return memory.pages.get(bookId);
  const u = BASE + "/book/newsShow.aspx?EN=qhfz&book_id=" + encodeURIComponent(bookId) + "&ppage_num=1";
  const { txt } = await get(u);
  const urls = [...new Set([...txt.matchAll(/<img[^>]+src=["']([^"']*\/jpg\/[^"']+\.jpg)["']/g)].map((m) => m[1]))];
  if (!urls.length) throw new Error("no page images for " + bookId);
  memory.pages.set(bookId, urls);
  return urls;
}

export async function qhCatalog(page = 1, rows = 50) {
  if (!memory.catalog || Date.now() - memory.at > 30 * 60 * 1000) {
    memory.catalog = await catalogRows(1, ""); // first page carries recordCount
    memory.at = Date.now();
  }
  const total = memory.catalog[0] ? memory.catalog[0].recordCount : memory.catalog.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * rows;
  const out = [];
  // fetch enough pages to cover the request
  const needPages = Math.min(pages, Math.ceil((start + rows) / PAGE_SIZE));
  for (let p = 1; p <= needPages; p++) {
    const rowsP = p === 1 && memory.catalog ? memory.catalog : await catalogRows(p, "");
    for (const r of rowsP) out.push(rowToBook(r));
  }
  return { ok: true, total, pageCount: pages, books: out.slice(start, start + rows).filter(Boolean) };
}

export async function qhSearch(q, page = 1, rows = 50) {
  if (!q) return qhCatalog(page, rows);
  const j = await catalogRows(1, q);
  const total = j[0] ? j[0].recordCount : j.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const needPages = Math.min(pages, Math.ceil((page * rows) / PAGE_SIZE));
  const out = [];
  for (let p = 1; p <= needPages; p++) {
    const rowsP = p === 1 ? j : await catalogRows(p, q);
    for (const r of rowsP) out.push(rowToBook(r));
  }
  return { ok: true, total, pageCount: pages, books: out.slice((page - 1) * rows, page * rows).filter(Boolean) };
}

export async function qhBookMeta(bookId) {
  const urls = await pageUrls(bookId);
  // try bookInfo for the title/author (also double-checks existence)
  let title = "", author = "", publication = "";
  try {
    const { txt } = await get(BASE + "/book/bookInfo.aspx?EN=qhfz&book_id=" + encodeURIComponent(bookId));
    const mt = txt.match(/<title>([^<]*)<\/title>/i);
    if (mt) title = mt[1].split("-").pop().trim();
    const ma = txt.match(/作\s*者[：:]\s*([^<\n]{1,80})/);
    if (ma) author = ma[1].trim();
    const mp = txt.match(/出版时间[：:]\s*([^<\n]{1,40})/);
    if (mp) publication = mp[1].trim();
  } catch { /* fallback */ }
  return {
    ok: true,
    title: title || bookId,
    author,
    publication,
    pageCount: urls.length,
    identifier: bookId,
    fileCount: urls.length,
  };
}

export async function qhPage(bookId, pageNum) {
  const urls = await pageUrls(bookId);
  const idx = Number(pageNum) - 1;
  if (!urls[idx]) return { ok: false, error: "page out of range" };
  return {
    ok: true,
    filePath: urls[idx].replace(IMG_BASE_ALT, IMG_BASE), // normalize to https host if alt
    text: "",
    pageTotalNumber: urls.length,
    fullPage: true,
  };
}

const SAFE_FILE = /^https:\/\/img\.wanjuan\.cn\/pic\/crrs\/books\/qhfz\/jpg\/[A-Za-z0-9_\-]+\/[a-z]\d{4,5}_00\.jpg$/;

export async function qhImage(filePath) {
  if (!SAFE_FILE.test(filePath) || filePath.includes("..")) return { ok: false, error: "invalid file path" };
  const { buf, ct } = await get(filePath);
  if (buf.length < 100) return { ok: false, error: "empty image" };
  return { ok: true, bytes: buf, type: ct.includes("image") ? ct : "image/jpeg" };
}

