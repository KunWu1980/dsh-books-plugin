// baotu.js — 报图览粤 (Guangdong Provincial Sun Yat-sen Library's "Baotu Lanyue",
// late-Qing/early-Republic Guangdong pictorial stories, 28 categories).
// Read-only anonymous adapter. No login, no encryption, raw image files are
// reachable directly. Model: catalog = 28 story chapters; opening a chapter
// yields one "page" per story (image + caption title).
const BASE = "http://183.63.187.59";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const TIMEOUT = 10000;
const MAX_PAGES = 60;

const chapterCache = { at: 0, data: null };
const storiesCache = new Map(); // chapterId -> { at, data }

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT) });
  const t = await r.text();
  return { status: r.status, t, final: r.url || "" };
}

// Parse the homepage for the 28 chapter links: /chapter/<id> "标题"
async function getChapters() {
  if (chapterCache.data && Date.now() - chapterCache.at < 30 * 60 * 1000) return chapterCache.data;
  const { t } = await fetchText(BASE + "/");
  const out = [];
  const re = /<a[^>]+href="\/chapter\/(\d+)"[^>]*>([^<]{1,40})<\/a>/gi;
  let mm;
  while ((mm = re.exec(t)) !== null) {
    const id = mm[1], title = mm[2].trim();
    if (title && !out.some((c) => c.id === id)) out.push({ id, title });
  }
  chapterCache.at = Date.now();
  chapterCache.data = out;
  return out;
}

// Walk every page of one chapter and collect its story entries.
// A story = {num (file basename), title (img title)}; raw file is
// /sites/default/files/stories/<num>_0.jpg (verified byte-for-byte with no itok).
async function chapterStories(cid) {
  const hit = storiesCache.get(String(cid));
  if (hit && Date.now() - hit.at < 30 * 60 * 1000) return hit.data;
  const seen = new Map(); // base filename -> {base, path, title}
  for (let p = 0; p < MAX_PAGES; p++) {
    const url = BASE + "/chapter/" + cid + (p ? "?page=" + p : "");
    let html;
    try { html = (await fetchText(url)).t; }
    catch { break; }
    const srcs = [...html.matchAll(/<img[^>]+src=["']([^"']*\/stories\/\d+(?:_\d+)?\.(?:jpe?g|png|gif))[^"']*["']/gi)].map((m) => m[1]);
    const titled = [...html.matchAll(/<img[^>]+src=["']([^"']*\/stories\/\d+(?:_\d+)?\.(?:jpe?g|png|gif))[^"']*["'][^>]*title="([^"]*)"/gi)].map((m) => [m[1], m[2].trim()]);
    const nodes = new Set([...html.matchAll(/href="\/node\/(\d+)"/g)].map((m) => m[1]));
    if (!srcs.length && !nodes.size) break; // past the last page (or empty chapter)
    let added = 0;
    for (const src of srcs) {
      const clean = src.split("?")[0];
      const base = clean.split("/").pop(); // e.g. 5_0.jpg
      if (!base || seen.has(base)) continue;
      const tl = titled.find((x) => x[0] === src);
      seen.set(base, { base, path: "/sites/default/files/stories/" + base, title: (tl && tl[1]) || "" });
      added++;
    }
    if (p > 0 && added === 0 && !nodes.size) break;
    if (p >= 2) await new Promise((r) => setTimeout(r, 120)); // be polite
  }
  const data = [...seen.values()];
  storiesCache.set(String(cid), { at: Date.now(), data });
  return data;
}

function rowToItem(c, count) {
  return {
    sourceId: "bt:c" + c.id,
    chapterId: c.id,
    title: c.title + (count ? "（" + count + " 则）" : ""),
    section: "",
    creator: "",
    kind: "chapter",
  };
}

// -- exports ---------------------------------------------------------------

export async function btCatalog(page = 1, rows = 50) {
  const chapters = await getChapters();
  const start = (page - 1) * rows;
  const slice = chapters.slice(start, start + rows);
  return { ok: true, total: chapters.length, books: slice.map((c) => rowToItem(c, 0)) };
}

export async function btSearch(q, page = 1, rows = 50) {
  const chapters = await getChapters();
  const ql = String(q || "").trim().toLowerCase();
  const matched = ql ? chapters.filter((c) => (c.title || "").toLowerCase().includes(ql)) : chapters;
  const start = (page - 1) * rows;
  const slice = matched.slice(start, start + rows);
  return { ok: true, total: matched.length, books: slice.map((c) => rowToItem(c, 0)) };
}

export async function btBookMeta(chapterId) {
  const stories = await chapterStories(String(chapterId || "").trim());
  const chapters = await getChapters();
  const c = chapters.find((x) => x.id === String(chapterId)) || { title: "报图览粤·画报" };
  return {
    ok: true,
    title: c.title + "（" + stories.length + " 则）",
    author: "广东省立中山图书馆·报图览粤",
    pageCount: Math.max(1, stories.length),
    chapterId: String(chapterId),
  };
}

export async function btPage(chapterId, pageNumber) {
  const cid = String(chapterId || "").trim();
  const stories = await chapterStories(cid);
  const total = Math.max(1, stories.length);
  const pn = Math.max(1, Math.min(total, parseInt(pageNumber, 10) || 1));
  const story = stories[pn - 1];
  if (!story) return { ok: true, filePath: "", text: "", pageTotalNumber: total };
  return {
    ok: true,
    filePath: story.path,
    text: story.title || "",
    pageTotalNumber: total,
  };
}

const IMG_OK = /^\/sites\/default\/files\/stories\/\d+_0\.jpg$/;

export async function btImage(filePath) {
  if (typeof filePath !== "string" || !IMG_OK.test(filePath) || filePath.includes("..")) {
    return { ok: false, error: "bad file path" };
  }
  const r = await fetch(BASE + filePath, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) return { ok: false, error: "http " + r.status };
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 100) return { ok: false, error: "too small" };
  return { ok: true, bytes: buf, type: "image/jpeg" };
}