// # hunan.js — 湖南省图书馆·古籍智慧化平台 只读适配器 (builtin:hn)
// 平台: https://hnlib.ydzh.net/pancient  (API base: /gujiapi)
// 鉴权: 请求头签名 sign = MD5(appId + nonceStr + timeStamp + systemVersion)，
//       响应体 AES-128-CBC ZeroPadding base64 加密，密钥 iv 同为固定 16 字节串。
// 版权边界: 仅供在线阅读，不下载、不落盘；版权归湖南图书馆/原权利方所有。
const BASE = "https://hnlib.ydzh.net/gujiapi";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DSH-Probe/1.0 hnlib-reader";
const KEY = "abcd20220105hnsx";
const IV = "abcd20220105hnsx";
const APP_ID = "hnstsg";
const VERSION = "1.0.0";
const NONCE_ALPHABET = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
const TIMEOUT = 25000;
const VOL_LIMIT = 100;
const MAX_PAGE_SCOPE = 20000; // 二分探测上限

import { createCipheriv, createDecipheriv, createHash } from "node:crypto";

function md5hex(s) { return createHash("md5").update(s, "utf8").digest("hex"); }
function decZero(b64) {
  const d = createDecipheriv("aes-128-cbc", Buffer.from(KEY, "latin1"), Buffer.from(IV, "latin1"));
  d.setAutoPadding(false);
  let out = Buffer.concat([d.update(Buffer.from(b64, "base64")), d.final()]);
  let end = out.length;
  while (end > 0 && out[end - 1] === 0) end--;
  return out.slice(0, end).toString("utf8");
}
function nonce(len = 32) {
  let s = "";
  for (let i = 0; i < len; i++) s += NONCE_ALPHABET.charAt(Math.floor(Math.random() * NONCE_ALPHABET.length));
  return s;
}
function signHeaders() {
  const ts = String(Date.now());
  const n = nonce();
  return {
    "User-Agent": UA,
    "Content-Type": "application/json",
    device: "5",
    appId: APP_ID,
    visitType: "5",
    systemVersion: VERSION,
    timeStamp: ts,
    nonceStr: n,
    Authorization: "",
    sign: md5hex(APP_ID + n + ts + VERSION),
  };
}
async function post(segment, body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const r = await fetch(BASE + segment, { method: "POST", headers: signHeaders(), body: JSON.stringify(body), signal: ctrl.signal });
    const txt = await r.text();
    let j;
    try { j = JSON.parse(txt); } catch { throw new Error("非 JSON 响应 " + r.status); }
    if (j.result) {
      let plain;
      try { plain = decZero(j.result); } catch (e) { throw new Error("AES 解密失败 " + e.message); }
      j = JSON.parse(plain);
    }
    if (j.code !== 200) throw new Error("hn API " + (j.msg || j.code || "error"));
    return j;
  } finally { clearTimeout(t); }
}

// ---------- catalog / search（目录与检索，服务端忽略过滤参数 → 本地过滤） ----------
let catalogCache = null;
async function allBooks() {
  if (catalogCache) return catalogCache;
  const first = await post("/guji/search/searchbook", { pageNum: 1, pageSize: 500 });
  const rows = first.rows || [];
  catalogCache = { rows, fetchedAt: Date.now() };
  return catalogCache;
}
function rowToBook(r) {
  return {
    sourceId: "hn:" + r.id,
    id: String(r.id),
    title: r.title || "",
    author: r.zhuZhe || "",
    edition: r.banben || "",
    dynasty: r.chaoDai || "",
    classification: (r.firstClassName || "") + (r.secondClassName ? "·" + r.secondClassName : ""),
    collectionUnit: r.laiyuan || "湖南省图书馆",
    callNumber: r.suoShuHao || "",
    cover: r.imgUrl || "",
    kind: "catalog",
  };
}
export async function hnCatalog(page = 1, rows = 100) {
  const { rows: all } = await allBooks();
  const start = (page - 1) * rows;
  return { total: all.length, list: all.slice(start, start + rows).map(rowToBook) };
}
export async function hnSearch(q, page = 1, rows = 100) {
  const { rows: all } = await allBooks();
  const kw = String(q || "").trim().toLowerCase();
  const ascii = (s) => s.toLowerCase();
  const trad = toTrad(kw); // 简体 → 繁体：古籍库标题为繁体
  const hay = ascii(kw) === ascii(trad) ? [ascii(kw)] : [ascii(kw), ascii(trad)];
  const hit = kw ? all.filter(r => {
    const fields = [r.title, r.zhuZhe, r.suoShuHao, r.firstClassName, r.secondClassName].filter(Boolean).map(ascii).join(" ");
    return hay.some(h => fields.includes(h));
  }) : all;
  const start = (page - 1) * rows;
  return { total: hit.length, list: hit.slice(start, start + rows).map(rowToBook) };
}

// 常见简繁对照（古籍书目标题常用字），仅用于检索回退，不追求全覆盖。
const TRAD_MAP = {
  "辞": "辭", "注": "註", "图": "圖", "书": "書", "经": "經", "传": "傳", "记": "記",
  "汉": "漢", "国": "國", "关": "關", "云": "雲", "华": "華", "县": "縣", "乡": "鄉",
  "义": "義", "礼": "禮", "节": "節", "乐": "樂", "诗": "詩", "赋": "賦", "词": "詞",
  "问": "問", "闻": "聞", "门": "門", "开": "開", "关": "關", "风": "風", "马": "馬",
  "鸟": "鳥", "鱼": "魚", "龙": "龍", "龟": "龜", "万": "萬", "与": "與", "为": "為",
  "后": "後", "发": "發", "复": "復", "习": "習", "学": "學", "教": "教", "师": "師",
  "处": "處", "時": "时", "间": "間", "阳": "陽", "阴": "陰", "陆": "陸", "陈": "陳",
  "刘": "劉", "张": "張", "杨": "楊", "苏": "蘇", "赵": "趙", "蒋": "蔣", "谢": "謝",
};
function toTrad(s) {
  return [...s].map(c => TRAD_MAP[c] || c).join("");
}

// ---------- meta（详情 + 卷信息 + 展平页数二分探测） ----------
const metaCache = new Map();
async function probeMaxPage(id) {
  let lo = 1, hi = MAX_PAGE_SCOPE, lastOk = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let ok = false;
    try {
      const r = await post("/reader/openBookSliderDImg", { productId: id, pageNum: mid });
      ok = !!r.data && !!r.data[0] && (r.data[0].sliderList || []).length > 0;
    } catch { ok = false; }
    if (ok) { lastOk = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return lastOk;
}
export async function hnBookMeta(id) {
  const key = String(id);
  const hit = metaCache.get(key);
  if (hit && Date.now() - hit.at < 30 * 60 * 1000) return hit.v;
  const d = (await post("/guji/gujiCongInfo/getInfo", { id: key })).data || {};
  const vols = (d.bookList || []).slice(0, VOL_LIMIT).map(v => ({
    volumeId: v.id,
    volumeTitle: v.gujiName || v.ceChi || "第" + v.sort + "册",
    pages: v.yeShu || 0,
  }));
  const maxPage = await probeMaxPage(key);
  const v = {
    sourceId: "hn:" + key,
    id: key,
    title: d.title || d.gujiName || "",
    author: d.zhuZhe || "",
    edition: d.banben || "",
    dynasty: d.chaoDai || "",
    classification: [d.firstClassName, d.secondClassName].filter(Boolean).join("·"),
    collectionUnit: d.laiyuan || d.organId || "",
    callNumber: d.suoShuHao || "",
    volumes: vols,
    pageCount: maxPage,
    description: [d.cunJuan, d.ceshu, d.banShi, d.banKuang].filter(Boolean).join(" / "),
  };
  metaCache.set(key, { at: Date.now(), v });
  return v;
}

// ---------- page / image（逐页 OCR 文本 + 内嵌 base64 大图） ----------
export async function hnPage(id, pageNumber) {
  const pn = Math.max(1, Number(pageNumber) || 1);
  const r = await post("/reader/openBookCheckTxt", { productId: String(id), pageNum: pn });
  const data = r.data || {};
  return {
    filePath: "",
    text: (data.content || "").replace(/\r\n/g, "\n").trim(),
    fullName: "",
    pageTotalNumber: 0,
    meta: { audioFlag: data.audioFlag, jsonUrl: data.jsonUrl },
  };
}
export async function hnImage(id, pageNumber) {
  const pn = Math.max(1, Number(pageNumber) || 1);
  const r = await post("/reader/openBookSliderDImg", { productId: String(id), pageNum: pn });
  const tiles = (r.data && r.data[0] && r.data[0].sliderList) || [];
  if (!tiles.length) throw new Error("hn 无该页图片");
  const b64 = tiles[0].imgByte || "";
  if (!b64) throw new Error("hn 无图片数据");
  const buf = Buffer.from(b64, "base64");
  if (buf.length < 100) throw new Error("hn 图片数据异常");
  return buf;
}