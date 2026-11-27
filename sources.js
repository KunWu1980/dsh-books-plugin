/**
 * @local/books — library source index bridge.
 *
 * Reads the weekly-published dist/sources.json from the dsh-library-sources
 * project and exposes it to the online-library UI, so the panel can list many
 * public libraries instead of hard-coding a single one. Read-only: the index
 * only tells us which sources exist and whether an adapter is available.
 *
 * Resilience: remote fetch -> on-disk cache -> embedded fallback, so the panel
 * never breaks when GitHub is unreachable or the certificate chain is odd.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INDEX_URL = "https://raw.githubusercontent.com/KunWu1980/dsh-library-sources/main/dist/sources.json";
const BUNDLED = path.join(path.dirname(fileURLToPath(import.meta.url)), "sources-index.json");
const CACHE_FILE = path.join(homedir(), ".dsh", "books-plugin", "sources-index.json");
const TTL = 6 * 60 * 60 * 1000; // 6 hours
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 DSH-Books/1.0";

const memory = { at: 0, data: null };

// Keep the fallback minimal but honest: nlc + guangdong are readable.
const FALLBACK = {
  schema: 1,
  name: "dsh-library-sources",
  updatedAt: null,
  count: 6,
  activeCount: 4,
  sources: [
    { id: "nlc", name: "国家图书馆·民国地方文献", region: "全国", category: "民国文献", priority: 0, status: "active", adapter: "builtin:nlc", capabilities: ["search", "browse", "page-image", "ocr-text"], rightsNote: "仅在线浏览，不下载、不落盘。" },
    { id: "jiangsu", name: "江苏省古籍数字资源平台", region: "江苏", category: "古籍", priority: 1, status: "active", adapter: "builtin:js", capabilities: ["browse", "search", "page-image"], adapterNote: "古书籍影像，单册直链逐页看图", rightsNote: "仅在线阅读，不下载、不落盘。" },
    { id: "guangdong", name: "广东省立中山图书馆·广东通志", region: "广东", category: "古籍/地方文献", priority: 1, status: "active", adapter: "builtin:gd", capabilities: ["browse", "metadata", "read"], adapterNote: "开放 OCR 全文，纯文本逐页阅读", rightsNote: "仅在线阅读，不下载、不落盘。" },
    { id: "shaanxi", name: "陕西省历史文献数据库", region: "陕西", category: "历史文献", priority: 1, status: "active", adapter: "builtin:sx", capabilities: ["browse", "search", "page-image"], adapterNote: "104 部古籍/方志，逐卷展平页码，图片阅读", rightsNote: "仅在线阅读，不下载、不落盘。" },
    { id: "sichuan", name: "四川省图书馆·珍贵古籍", region: "四川", category: "古籍", priority: 1, status: "candidate", adapter: "none", adapterNote: "端点待逆向" },
    { id: "hunan", name: "湖南省图书馆古籍智慧化平台", region: "湖南", category: "古籍", priority: 2, status: "active", adapter: "builtin:hn", capabilities: ["browse", "search", "page-image", "ocr-text"], adapterNote: "古籍智慧化平台，逐页原图 + OCR 文本对照", rightsNote: "仅在线阅读，不下载、不落盘。" },
  ],
};

function valid(data) {
  return Boolean(data && Array.isArray(data.sources) && data.sources.length > 0);
}

// Adapters this plugin actually ships. These override the weekly index so a
// stale remote/disk cache can never mark a locally-readable source as "none".
const LOCAL_ADAPTERS = {
  nlc: { adapter: "builtin:nlc", status: "active" },
  guangdong: { adapter: "builtin:gd", status: "active" },
  shaanxi: { adapter: "builtin:sx", status: "active" },
  jiangsu: { adapter: "builtin:js", status: "active" },
  hunan: { adapter: "builtin:hn", status: "active" },
};

function withLocalAdapters(data) {
  if (!data || !Array.isArray(data.sources)) return data;
  const sources = data.sources.map((s) => {
    const o = LOCAL_ADAPTERS[s.id];
    return o ? { ...s, adapter: o.adapter, status: o.status } : s;
  });
  const activeCount = sources.filter((s) => s.adapter && s.adapter !== "none").length;
  return { ...data, sources, activeCount };
}

function readDisk() {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const data = JSON.parse(readFileSync(CACHE_FILE, "utf8").replace(/^\uFEFF/, ""));
    return valid(data) ? data : null;
  } catch {
    return null;
  }
}

function writeDisk(data) {
  try {
    mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(data), "utf8");
  } catch {
    /* cache write is best-effort */
  }
}

/**
 * Return the source index. `force=true` bypasses the memory TTL and re-fetches.
 * Result always carries `origin` (remote|disk|fallback) and `cached` flags.
 */
export async function librarySources(force = false) {
  const now = Date.now();
  if (!force && memory.data && now - memory.at < TTL) {
    return { ...withLocalAdapters(memory.data), cached: true, origin: "memory" };
  }
  try {
    const r = await fetch(INDEX_URL, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (r.ok) {
      const data = await r.json();
      if (valid(data)) {
        memory.at = now;
        memory.data = data;
        writeDisk(data);
        return { ...withLocalAdapters(data), cached: false, origin: "remote" };
      }
    }
  } catch {
    /* fall through to disk / fallback */
  }
  const disk = readDisk();
  if (disk) {
    memory.at = now;
    memory.data = disk;
    return { ...withLocalAdapters(disk), cached: true, origin: "disk" };
  }
  // Bundled baseline (shipped with the plugin) — always available on a fresh install.
  try {
    const bundled = JSON.parse(readFileSync(BUNDLED, "utf8").replace(/^\uFEFF/, ""));
    if (valid(bundled)) {
      memory.at = now;
      memory.data = bundled;
      writeDisk(bundled);
      return { ...withLocalAdapters(bundled), cached: true, origin: "bundled" };
    }
  } catch { /* fall through to hardcoded fallback */ }
  memory.at = now;
  memory.data = FALLBACK;
  return { ...FALLBACK, cached: true, origin: "fallback" };
}
