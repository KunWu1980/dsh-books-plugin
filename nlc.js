/**
 * @local/books — National Library of China (NLC) public-domain reader bridge.
 *
 * Talks to the anonymous, public "民国地方文献知识库" (Republican-era local
 * gazetteers) API at mg.nlc.cn. Everything here is read-only browsing: no
 * downloads, no writes into the local shelf. Images are streamed through the
 * Host so the browser stays same-origin and no hotlinking/network policy gets
 * in the way.
 *
 * Verified chain (2026-11-27):
 *   catalog      POST bookApi/selectBookPropertiesList?page&rows&sort&order
 *   search       POST bookApi/selectBookSourceListByKeyWord?keyWord&page&rows
 *   page list    POST bookApi/selectBookPageList?sourceId&volume&pageNumber
 *   info         POST bookApi/selectBookInfo?sourceId&identifier&volume&pageNumber
 *   page data    POST bookApi/selectBookContentInfo?sourceId&volume&pageNumber
 *   image bytes  GET  https://mg.nlc.cn/guotu/<filePath>
 */

const API = "https://mg.nlc.cn/api/";
const FILES = "https://mg.nlc.cn/guotu/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 DSH-Books/1.0";

// Short-lived in-memory metadata cache (book meta rarely changes).
const metaCache = new Map();
const META_TTL = 10 * 60 * 1000;

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** POST a form-style (query-string) request to an NLC endpoint. */
async function post(segment, params = {}) {
  const u = new URL(API + segment);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  }
  const r = await fetch(u.toString(), {
    method: "POST",
    headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*" },
    signal: AbortSignal.timeout(20000),
  });
  const txt = await r.text();
  let json;
  try { json = JSON.parse(txt); } catch { throw new Error("NLC 返回了非 JSON 响应: " + txt.slice(0, 120)); }
  if (!json || json.code !== 0) throw new Error(json?.msg || ("NLC 错误 code=" + json?.code));
  return json.data;
}

/** Strip the OCR markup (p / span / entities) into readable plain text. */
function htmlToText(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Normalize a catalog/search row into a small, UI-friendly object. */
function rowToBook(r, kind) {
  const filePath = String(r.filePath || "");
  const parts = filePath.split("/");
  // filePath looks like 2021MGZS/JPG/<sourceId>/<volume>/<file>.jpg
  const volume = parts.length >= 4 ? parts[parts.length - 2] : "001";
  return {
    sourceId: String(r.sourceId || ""),
    identifier: String(r.identifier || ""),
    volume,
    title: String(r.sourceName || r.title || ""),
    section: String(r.title || ""),
    type: String(r.type || ""),
    classification: String(r.classification || ""),
    abstract: htmlToText(r.bookAbstract || "").slice(0, 400),
    keyword: String(r.keyword || "").replace(/<[^>]+>/g, ""),
    author: String(r.author || ""),
    publishDate: String(r.publishDate || ""),
    publisher: String(r.publisher || ""),
    kind, // "catalog" | "search"
  };
}

/** Browse the book-level catalog (319 public-domain titles). */
export async function nlcCatalog(page = 1, rows = 20) {
  const p = Math.max(1, num(page, 1));
  const r = Math.min(60, Math.max(1, num(rows, 20)));
  const data = await post("bookApi/selectBookPropertiesList", {
    page: String(p), rows: String(r), sort: "createTime", order: "desc",
  });
  const books = (data?.rows || []).map((x) => rowToBook(x, "catalog"));
  return { ok: true, total: num(data?.total, books.length), page: p, rows: r, books };
}

/** Keyword search across sections/abstracts. Deduped by sourceId for a clean list. */
export async function nlcSearch(query, page = 1, rows = 30) {
  const q = String(query || "").trim();
  if (!q) throw new Error("请输入检索关键词");
  const p = Math.max(1, num(page, 1));
  const r = Math.min(60, Math.max(1, num(rows, 30)));
  const data = await post("bookApi/selectBookSourceListByKeyWord", {
    keyWord: q, page: String(p), rows: String(r),
  });
  const seen = new Set();
  const books = [];
  for (const x of (data || [])) {
    const b = rowToBook(x, "search");
    if (seen.has(b.sourceId)) continue;
    seen.add(b.sourceId);
    books.push(b);
  }
  return { ok: true, query: q, total: Array.isArray(data) ? data.length : books.length, page: p, books };
}

/**
 * Resolve the volume + a stable identifier + page count for a book.
 * Cached per sourceId for 10 minutes.
 */
export async function nlcBookMeta(sourceId, volume) {
  const sid = String(sourceId || "");
  if (!sid) throw new Error("缺少 sourceId");
  const vol = String(volume || "001") || "001";
  const key = sid + "|" + vol;
  const hit = metaCache.get(key);
  if (hit && Date.now() - hit.at < META_TTL) return hit.value;

  // Page list gives us a real identifier and the highest file number.
  const parts = await post("bookApi/selectBookPageList", {
    sourceId: sid, volume: vol, pageNumber: "1",
  });
  const list = Array.isArray(parts) ? parts : [];
  let totalPages = 0;
  for (const p of list) totalPages = Math.max(totalPages, num(p.endFileNum, 0));
  const identifier = list[0]?.identifier || "";

  // Info gives us the human title and (when present) an authoritative count.
  let sourceName = "";
  let pageTotal = totalPages;
  try {
    const info = await post("bookApi/selectBookInfo", {
      sourceId: sid, identifier, volume: vol, pageNumber: "1",
    });
    sourceName = String(info?.sourceName || info?.title || "");
    if (num(info?.pageTotalNumber, 0) > 0) pageTotal = num(info.pageTotalNumber, pageTotal);
  } catch { /* info is optional; page list is enough */ }

  const value = {
    ok: true, sourceId: sid, volume: vol, identifier,
    title: sourceName,
    pageCount: Math.max(1, pageTotal),
    parts: list.length,
  };
  metaCache.set(key, { at: Date.now(), value });
  return value;
}

/** Get one page's exact image path + OCR text. */
export async function nlcPage(sourceId, volume, pageNumber) {
  const sid = String(sourceId || "");
  const vol = String(volume || "001") || "001";
  const pn = Math.max(1, num(pageNumber, 1));
  if (!sid) throw new Error("缺少 sourceId");
  const data = await post("bookApi/selectBookContentInfo", {
    sourceId: sid, volume: vol, pageNumber: String(pn),
  });
  const files = data?.filePathArray || [];
  const entry = files.find((f) => num(f.pageNumber, 0) === pn) || files[0] || {};
  const filePath = String(entry.filePath || "");
  if (!filePath) throw new Error("该页没有可用的图片");
  return {
    ok: true,
    sourceId: sid, volume: vol, pageNumber: pn,
    filePath,
    text: htmlToText(entry.content || ""),
    pageTotalNumber: num(data?.pageTotalNumber, 0),
  };
}

/** Fetch raw image bytes from the NLC file server, with a small LRU-ish guard. */
export async function nlcImage(filePath) {
  const fp = String(filePath || "");
  // Only allow the exact path shape NLC uses; never let the caller pick a host.
  if (!/^[A-Za-z0-9_\-\/]+\.jpg$/i.test(fp) || fp.includes("..")) throw new Error("无效的图片路径");
  const r = await fetch(FILES + fp, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw new Error("图片加载失败 (HTTP " + r.status + ")");
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 100) throw new Error("图片内容为空");
  return buf;
}
