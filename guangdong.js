/**
 * @local/books — Guangdong provincial library (Sun Yat-sen Library) reader bridge.
 *
 * Talks to the anonymous, read-only "广东通志" digitisation API at
 * 183.63.187.55 (the platform behind zslib.com.cn open resources). Everything
 * here is browse-only: no downloads, no writes to the local shelf.
 *
 * Unlike the NLC source, this platform exposes its OCR text directly in JSON,
 * so we deliver a text-only reader — no image AES decryption is required.
 *
 * Verified chain (2026-11-28):
 *   tree      GET /prod-api/client/tree/list?type=1            -> tree with 25 leaves carrying mediaId
 *   metadata  GET /prod-api/client/base/getMediaTrees?baseId=  -> remark JSON (title/author/...)
 *   files     GET /prod-api/client/base/listFiles?mediaId=     -> [{id,fullName,content,simpleContent}]
 *   punctuated GET /prod-api/client/base/getFileContentPunc?fileId= -> better-readable OCR
 */

const BASE = "http://183.63.187.55";
const API = BASE + "/prod-api";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 DSH-Books/1.0";
const CACHE_TTL = 30 * 60 * 1000;

const leafCache = new Map();  // treeId(String) -> leaf
const filesCache = new Map(); // mediaId(String) -> {at, files}

function str(v) { return String(v ?? ""); }
function num(v, fb) { const n = Number(v); return Number.isFinite(n) ? n : fb; }

async function get(segment, params = {}) {
  const u = new URL(API + segment);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  }
  const r = await fetch(u.toString(), {
    headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*" },
    signal: AbortSignal.timeout(20000),
  });
  const txt = await r.text();
  let json;
  try { json = JSON.parse(txt); } catch { throw new Error("广东图书馆返回了非 JSON 响应: " + txt.slice(0, 120)); }
  if (json && json.code !== undefined && json.code !== 200) throw new Error(json.msg || ("广东图书馆错误 code=" + json.code));
  return json.data ?? json;
}

function walk(nodes, out = []) {
  for (const n of nodes || []) {
    if (n.children && n.children.length) walk(n.children, out);
    else out.push(n);
  }
  return out;
}

async function allLeaves() {
  const tree = await get("/client/tree/list", { type: "1" });
  const leaves = walk(tree).filter((n) => n.mediaId);
  for (const n of leaves) leafCache.set(str(n.id), n);
  return leaves;
}

function leafToBook(n) {
  return {
    sourceId: "gd:" + n.id,   // unique key for the UI list
    treeId: String(n.id),
    mediaId: String(n.mediaId),
    baseId: String(n.baseId || ""),
    title: str(n.name),
    section: str(n.description || "").slice(0, 120),
    author: "",
    publishDate: "",
    publisher: "",
    classification: "",
    abstract: str(n.description || "").slice(0, 200),
    kind: "catalog",
  };
}

/** Browse the digitised volumes (tree leaves that carry a mediaId). */
export async function gdCatalog(page = 1, rows = 100) {
  const leaves = await allLeaves();
  const r = Math.min(200, Math.max(1, num(rows, 100)));
  const books = leaves.map(leafToBook).slice(0, r);
  return { ok: true, total: books.length, page: 1, rows: r, books };
}

/** Local keyword search over the small tree (title + description). */
export async function gdSearch(query, page = 1, rows = 100) {
  const q = str(query || "").trim();
  const leaves = await allLeaves();
  const r = Math.min(200, Math.max(1, num(rows, 100)));
  const matches = leaves
    .filter((n) => !q || (str(n.name) + str(n.description)).toLowerCase().includes(q.toLowerCase()))
    .map(leafToBook);
  const books = matches.slice(0, r);
  return { ok: true, query: q, total: matches.length, page: 1, books };
}

async function cachedFiles(mediaId) {
  const key = str(mediaId);
  const hit = filesCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.files;
  const data = await get("/client/base/listFiles", { mediaId: key });
  const files = Array.isArray(data) ? data : [];
  filesCache.set(key, { at: Date.now(), files });
  return files;
}

/** Resolve a tree leaf into a readable book: title, author, page count. */
export async function gdBookMeta(treeId) {
  const id = str(treeId || "");
  if (!id) throw new Error("缺少 treeId");
  let leaf = leafCache.get(id);
  if (!leaf) leaf = (await allLeaves()).find((n) => str(n.id) === id);
  if (!leaf) throw new Error("找不到该书");

  const files = await cachedFiles(leaf.mediaId);
  let title = str(leaf.name);
  let author = "";
  let description = str(leaf.description || "");
  try {
    const mt = await get("/client/base/getMediaTrees", { baseId: leaf.baseId || "1" });
    const remark = mt?.remark;
    if (remark) {
      const meta = typeof remark === "string" ? JSON.parse(remark) : remark;
      title = str(meta["题名"] || title);
      author = str(meta["主要责任者"] || "");
      description = str(meta["提要"] || description);
    }
  } catch { /* metadata is optional; the tree leaf is enough */ }

  return {
    ok: true, treeId: id, title, author, description,
    pageCount: Math.max(1, files.length),
  };
}

/** One page: OCR text (punctuated when available). No image — text-only reader. */
export async function gdPage(treeId, pageNumber) {
  const id = str(treeId || "");
  const pn = Math.max(1, num(pageNumber, 1));
  if (!id) throw new Error("缺少 treeId");
  let leaf = leafCache.get(id);
  if (!leaf) leaf = (await allLeaves()).find((n) => str(n.id) === id);
  if (!leaf) throw new Error("找不到该书");
  const files = await cachedFiles(leaf.mediaId);
  const f = files[pn - 1];
  if (!f) throw new Error("页码超出范围");
  let text = str(f.simpleContent || f.content || "");
  try {
    const p = await get("/client/base/getFileContentPunc", { fileId: f.id });
    text = str(p?.simpleContent || p?.content || text);
  } catch { /* fall back to the unpunctuated OCR already in listFiles */ }
  return {
    ok: true, treeId: id, pageNumber: pn,
    filePath: "", // no downloadable image — the client hides the <img> when empty
    text,
    fullName: str(f.fullName || ""),
    pageTotalNumber: files.length,
  };
}
