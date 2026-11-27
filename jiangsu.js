// jiangsu.js — 江苏省古籍数字资源集成平台 (zggj.jslib.org.cn) 只读适配器
// 纯图片阅读：mainSearch 书目/检索（不加密）+ 参数 AES-128-CBC 加密（getBookById/getMasterSlaveCatalogue）+ 图片直链 thumbnails/*.jpg 匿名可读
import { createCipheriv, createDecipheriv } from "node:crypto";

const BASE = "http://zggj.jslib.org.cn";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DSH-Books/1.0";
const KEY = Buffer.from("MSQLHKJ1007JIANG", "utf8");
const IV = Buffer.from("JIANGSUMSQ1007lh", "utf8");

const metaCache = new Map(); // id -> meta
const META_TTL = 30 * 60 * 1000;
const VOL_LIMIT = 40;        // 每书最多展平 40 册（大部分书 <10 册）
const PAGE_HI = 600;         // 单册页数二分上界

function pad0(data) {
  const p = 16 - (data.length % 16);
  return p ? Buffer.concat([data, Buffer.alloc(p)]) : data;
}
function enc(plain) {
  const c = createCipheriv("aes-128-cbc", KEY, IV);
  c.setAutoPadding(false);
  return Buffer.concat([c.update(pad0(Buffer.from(String(plain), "utf8"))), c.final()]).toString("base64");
}
function dec(b64) {
  const d = createDecipheriv("aes-128-cbc", KEY, IV);
  d.setAutoPadding(false);
  let out = Buffer.concat([d.update(Buffer.from(b64, "base64")), d.final()]);
  let end = out.length;
  while (end > 0 && out[end - 1] === 0) end--;
  return out.slice(0, end).toString("utf8");
}

async function post(seg, obj) {
  const r = await fetch(BASE + seg, {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/json", Accept: "application/json, text/plain, */*" },
    body: JSON.stringify(obj),
  });
  if (!r.ok) throw new Error(`js post ${seg} HTTP ${r.status}`);
  const j = await r.json();
  if (!j || j.code !== 200) throw new Error((j && (j.message || j.msg)) || `js post ${seg} code!=200`);
  return j.data;
}
async function get(seg, params) {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${BASE}${seg}?${qs}`, {
    headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*" },
  });
  if (!r.ok) throw new Error(`js get ${seg} HTTP ${r.status}`);
  const j = await r.json();
  if (!j || j.code !== 200) throw new Error((j && (j.message || j.msg)) || `js get ${seg} code!=200`);
  return j.data;
}

async function imgExists(bookId, page) {
  const p = String(page).padStart(4, "0");
  try {
    const r = await fetch(`${BASE}/medias/${bookId}/thumbnails/${p}/medium.jpg`, {
      headers: { "User-Agent": UA },
      redirect: "manual",
    });
    return r.status === 200;
  } catch {
    return false;
  }
}
async function probePages(bookId, hi = PAGE_HI) {
  if (!(await imgExists(bookId, 1))) return 0;
  let lo = 1, h = 1;
  while (h < hi && (await imgExists(bookId, h + 1))) h *= 2;
  let top = Math.min(hi, Math.max(h, 1));
  let from = 1, to = top;
  while (from < to) {
    const mid = Math.ceil((from + to) / 2);
    if (await imgExists(bookId, mid)) from = mid;
    else to = mid - 1;
  }
  return from;
}

function rowToBook(b) {
  return {
    sourceId: "js:" + b.id,
    id: b.id,
    title: b.title || "",
    author: b.author || "",
    edition: b.edition || "",
    years: b.years || "",
    classification: b.classification || "",
    masterSlave: b.masterSlave || "",
    ocrState: b.ocrState || "0",
    collectionUnit: b.address || "",
    coverPicture: b.coverPicture || "",
  };
}

export async function jsCatalog(page = 1, rows = 15) {
  const data = await post("/portal/book/mainSearch", {
    typeId: 80, index1: "ancientbook", variantsType: 0, digitalResourcesType: 0, userId: "",
    page: Math.max(1, Number(page) || 1), limit: Math.min(100, Math.max(1, Number(rows) || 15)), esParams: [],
  });
  const list = Array.isArray(data && data.list) ? data.list.map(rowToBook) : [];
  return { total: Number(data && data.count) || 0, list };
}

export async function jsSearch(q, page = 1, rows = 30) {
  const list = await post("/portal/book/mainSearch", {
    typeId: 80, index1: "ancientbook", variantsType: 0, digitalResourcesType: 0, userId: "",
    page: Math.max(1, Number(page) || 1), limit: Math.min(100, Math.max(1, Number(rows) || 30)),
    esParams: [{ searchName: "title", searchValue: String(q || "").trim(), searchRelation: 1, searchType: 0, searchPhrase: 1 }],
  }).then((d) => rowSearch(d));
  return list;
}
function rowSearch(data) {
  const list = Array.isArray(data && data.list) ? data.list.map(rowToBook) : [];
  return { total: Number(data && data.count) || 0, list };
}

async function pool(tasks, n = 4) {
  const out = new Array(tasks.length);
  let i = 0;
  const worker = async () => {
    while (i < tasks.length) {
      const k = i++;
      out[k] = await tasks[k]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, worker));
  return out;
}

export async function jsBookMeta(id) {
  const key = String(id || "").trim();
  if (!key) throw new Error("missing id");
  const hit = metaCache.get(key);
  if (hit && Date.now() - hit.t < META_TTL) return hit.v;

  const attrs = await get("/portal/book/getBookById", { bookId: enc(key) });
  const a = {};
  for (const it of Array.isArray(attrs) ? attrs : []) a[it.captions] = it.attributeValue;

  let volumes = [];
  let pageCount = 0;
  try {
    const cat = await get("/portal/book/getMasterSlaveCatalogue", { bookId: enc(key), typeId: "80" });
    const vols = JSON.parse(dec(cat));
    const vids = (Array.isArray(vols) ? vols : []).slice(0, VOL_LIMIT);
    const counts = await pool(vids.map((v) => () => probePages(v.bookId || key)), 4);
    counts.forEach((pc, i) => {
      const v = vids[i];
      volumes.push({ bookId: v.bookId || key, bookName: v.bookName || ("册次 " + (v.volumeNum || i + 1)), volumeNum: v.volumeNum, pages: pc });
      pageCount += pc;
    });
  } catch {
    const pc = await probePages(key);
    volumes = [{ bookId: key, bookName: a["题名"] || "单册", volumeNum: "1", pages: pc }];
    pageCount = pc;
  }

  const meta = {
    sourceId: "js:" + key,
    id: key,
    title: a["题名"] || "",
    author: a["主要责任者"] || "",
    edition: a["版本类别"] || "",
    years: a["年代"] || "",
    collectionUnit: a["收藏单位"] || "",
    volumes,
    pageCount,
  };
  metaCache.set(key, { t: Date.now(), v: meta });
  return meta;
}

export async function jsPage(id, pageNumber) {
  const meta = await jsBookMeta(id);
  let cursor = 1;
  const ranges = [];
  for (const v of meta.volumes) {
    ranges.push({ bookId: v.bookId, start: cursor, len: v.pages });
    cursor += v.pages;
  }
  const total = Math.max(1, cursor - 1);
  const pn = Math.min(Math.max(1, Number(pageNumber) || 1), total);
  let r = ranges[0] || { bookId: id, start: 1, len: total };
  for (const rr of ranges) {
    if (pn >= rr.start && pn < rr.start + rr.len) { r = rr; break; }
  }
  const inVol = pn - r.start + 1;
  return {
    filePath: `/medias/${r.bookId}/thumbnails/${String(inVol).padStart(4, "0")}/large.jpg`,
    text: "",
    pageNumber: pn,
    pageTotalNumber: total,
    title: meta.title,
  };
}

const FILE_RE = /^\/medias\/[A-Za-z0-9\-]+\/thumbnails\/\d{4}\/(small|medium|large)\.jpg$/;
export async function jsImage(filePath) {
  if (!FILE_RE.test(filePath) || filePath.includes("..")) throw new Error("invalid image path");
  const r = await fetch(BASE + filePath, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("image HTTP " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 100) throw new Error("empty image");
  return buf;
}