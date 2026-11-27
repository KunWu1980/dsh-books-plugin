/**
 * @local/books — Shaanxi provincial library (陕西省图书馆) historical documents bridge.
 *
 * Talks to the anonymous, read-only "陕西省历史文献数据库" at
 * lswxsjk.sxlib.org.cn (rare books / Shaanxi gazetteers / Republican newspapers).
 * API prefix: /ancientshaanxi; responses: { state: 200, message: "SUCCESS", data }.
 *
 * Verified chain (2026-11-28):
 *   catalog    GET /homePage/getRareAll               -> nationalList(48) + provinceList(56)
 *   meta       GET /homeBook/bookWholeDetail?wholeId= -> title/creator/editionDescription/...
 *   volumes    GET /homeBook/bookVolumeAll?wholeId=   -> [{volumeId,volumeTitle}]
 *   vol pages  GET /homeBook/bookPageList?wholeId&volumeId -> {total,list[]} (pagination ignored)
 *   image      GET /ancientshaanxi/whole/<W>/<V>/watermark/<NNNN>.jpg -> full-size JPEG
 *
 * Page images are built directly from wholeId/volumeId/pageNumber (4-digit zero
 * padded): swap the API's "watermarkThumbnail" part of the URL for "watermark".
 * No OCR text layer is exposed for now, so this is an image-only adapter.
 */

const BASE = "https://lswxsjk.sxlib.org.cn/ancientshaanxi";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 DSH-Books/1.0";

const metaCache = new Map();   // wholeId -> {at, value}
const rangeCache = new Map();  // wholeId -> {at, ranges:[{vol,start,len}] total}
const VOL_LIMIT = 60;          // flatten at most this many volumes per book
const CONCURRENCY = 6;
const TTL = 30 * 60 * 1000;

function str(v) { return String(v ?? ""); }
function num(v, fb) { const n = Number(v); return Number.isFinite(n) ? n : fb; }
function fresh(k) { const h = metaCache.get(k) || rangeCache.get(k); return h && Date.now() - h.at < TTL; }

async function get(segment, params = {}) {
  const u = new URL(BASE + segment);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  }
  const r = await fetch(u.toString(), {
    headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*" },
    signal: AbortSignal.timeout(25000),
  });
  const txt = await r.text();
  let json;
  try { json = JSON.parse(txt); } catch { throw new Error("陕西图书馆返回了非 JSON 响应: " + txt.slice(0, 120)); }
  if (json && json.state !== undefined && json.state !== 200) throw new Error(json.message || ("陕西图书馆错误 state=" + json.state));
  return json.data;
}

async function pool(items, work, size = CONCURRENCY) {
  const out = new Array(items.length);
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await work(items[idx], idx);
    }
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, run));
  return out;
}

function rowToBook(r) {
  return {
    sourceId: "sx:" + r.wholeId, // unique key for the UI list
    wholeId: String(r.wholeId),
    title: str(r.title),
    section: str(r.structure || ""),
    creator: str(r.creator || ""),
    edition: str(r.editionDescription || ""),
    collectionUnit: str(r.collectionUnit || ""),
    callNumber: str(r.callNumber || ""),
    yearDate: str(r.yearDate || ""),
    columnName: str(r.columnNameString || ""),
    kind: "catalog",
  };
}

/** Browse the digitised catalogue (national 48 + provincial 56 titles). */
export async function sxCatalog(page = 1, rows = 100) {
  const p = Math.max(1, num(page, 1));
  const r = Math.min(200, Math.max(1, num(rows, 100)));
  const data = await get("/homePage/getRareAll");
  const all = [...(data?.nationalList || [])]
    .concat(data?.provinceList || [])
    .map(rowToBook)
    .filter((b) => b.wholeId);
  const books = all.slice((p - 1) * r, (p - 1) * r + r);
  return { ok: true, total: all.length, page: p, rows: r, books };
}

/** Keyword search over the small catalogue (title + structure + creator). */
export async function sxSearch(query, page = 1, rows = 100) {
  const q = str(query || "").trim();
  const p = Math.max(1, num(page, 1));
  const r = Math.min(200, Math.max(1, num(rows, 100)));
  const data = await get("/homePage/getRareAll");
  const all = [...(data?.nationalList || [])]
    .concat(data?.provinceList || [])
    .map(rowToBook)
    .filter((b) => b.wholeId);
  const matches = all.filter((b) =>
    !q || (b.title + " " + b.section + " " + b.creator + " " + b.collectionUnit).toLowerCase().includes(q.toLowerCase()));
  const books = matches.slice((p - 1) * r, (p - 1) * r + r);
  return { ok: true, query: q, total: matches.length, page: p, books };
}

/** Cumulative page ranges per wholeId (flattened across volumes, capped). */
async function pageRanges(wholeId) {
  const hit = rangeCache.get(wholeId);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  const vols = await get("/homeBook/bookVolumeAll", { wholeId });
  const list = (Array.isArray(vols) ? vols : []).slice(0, VOL_LIMIT);
  const totals = await pool(list, async (v) => {
    try {
      const pg = await get("/homeBook/bookPageList", { wholeId, volumeId: v.volumeId });
      return { volumeId: str(v.volumeId), total: Math.max(1, num(pg?.total, 0)) };
    } catch { return { volumeId: str(v.volumeId), total: 1 }; }
  });
  const ranges = [];
  let cursor = 1;
  for (const t of totals) {
    ranges.push({ volumeId: t.volumeId, start: cursor, len: t.total });
    cursor += t.total;
  }
  const value = { ranges, pageCount: totals.length ? cursor - 1 : 0 };
  rangeCache.set(wholeId, { at: Date.now(), value });
  return value;
}

/** Book metadata + real page count (sum across volumes, capped at VOL_LIMIT). */
export async function sxBookMeta(wholeId) {
  const wid = str(wholeId || "");
  if (!wid) throw new Error("缺少 wholeId");
  const hit = metaCache.get(wid);
  if (hit && Date.now() - hit.at < TTL) return hit.value;

  const kind = /^\d+$/.test(wid) ? "wholeId" : "id";
  let detail;
  try { detail = await get("/homeBook/bookWholeDetail", { [kind]: wid }); }
  catch { detail = await get("/homeBook/bookWholeDetail", { wholeId: wid }); }
  const ranges = await pageRanges(wid);
  const volumes = ranges.ranges.map((r) => r.volumeId);

  const value = {
    ok: true, wholeId: wid,
    title: str(detail?.title || ""),
    author: str(detail?.creator || ""),
    edition: str(detail?.editionDescription || ""),
    collectionUnit: str(detail?.collectionUnit || ""),
    callNumber: str(detail?.callNumber || ""),
    structure: str(detail?.structure || ""),
    category: str(detail?.columnNameString || ""),
    volumeCount: volumes.length,
    pageCount: ranges.pageCount,
  };
  metaCache.set(wid, { at: Date.now(), value });
  return value;
}

/** Map a flat page number onto (volumeId, pageInVolume) and build the image path. */
export async function sxPage(wholeId, pageNumber) {
  const wid = str(wholeId || "");
  const pn = Math.max(1, num(pageNumber, 1));
  if (!wid) throw new Error("缺少 wholeId");
  const { ranges, pageCount } = await pageRanges(wid);
  const safe = Math.min(pn, Math.max(1, pageCount));
  const seg = ranges.find((r) => safe >= r.start && safe < r.start + r.len) || ranges[0];
  if (!seg) throw new Error("该书没有可浏览的页面");
  const inVol = safe - seg.start + 1;
  const filePath = `whole/${wid}/${seg.volumeId}/watermark/${String(inVol).padStart(4, "0")}.jpg`;
  return { ok: true, wholeId: wid, pageNumber: safe, filePath, text: "", pageTotalNumber: pageCount };
}

/** Fetch raw image bytes from the Shaanxi file server. */
export async function sxImage(filePath) {
  const fp = String(filePath || "");
  // Only allow the exact page-image path shape; never pick another host.
  if (!/^whole\/\d+\/\d+\/watermark\/\d{4}\.jpg$/i.test(fp) || fp.includes("..")) throw new Error("无效的图片路径");
  const r = await fetch(BASE + "/" + fp, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw new Error("图片加载失败 (HTTP " + r.status + ")");
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 100) throw new Error("图片内容为空");
  return buf;
}