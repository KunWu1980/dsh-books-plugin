/**
 * @local/books — Host side.
 *
 * Owns the book library on disk, extracts text with the bundled Python,
 * registers exact /api/books/* Fetch routes for the browser panel, and
 * registers agent tools so the model can read the same library.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, renameSync, rmdirSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as nlc from "./nlc.js";
import * as gd from "./guangdong.js";
import * as sx from "./shaanxi.js";
import * as sources from "./sources.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const EXTRACTOR = path.join(here, "extractor.py");
const RENDERER = path.join(here, "render_page.py");
const PAGE_CACHE = path.join(homedir(), ".dsh", "books-plugin", "page-cache");
const EXTRACT_CACHE_DIR = path.join(homedir(), ".dsh", "books-plugin", "extract-cache");
const CONFIG_FILE = path.join(homedir(), ".dsh", "books-plugin", "config.json");
const DEFAULT_LIB = path.join(homedir(), "Books");
const SUPPORTED = [".txt", ".epub", ".pdf", ".azw3", ".mobi", ".azw", ".doc", ".docx"];

const inject = ["tools"];

// Reading typography. Defaults follow GB/T 9704-2012 (党政机关公文格式):
// body in 仿宋, 22 lines per page, 28 characters per line, 1.75x line spacing.
const TYPO_DEFAULTS = {
	preset: "gov",
	lines: 22,
	chars: 28,
	lineHeight: 1.75,
	font: "fangsong",
	indent: true,
	justify: true,
	// Reading colour scheme. "auto" follows the host theme; the rest are
	// fixed palettes (paper, sepia for eye comfort, night, dark).
	theme: "auto",
};
const TYPO_PRESETS = ["gov", "comfort", "compact", "large", "auto", "custom"];
const TYPO_FONTS = ["fangsong", "song", "hei", "kai", "system"];
const TYPO_THEMES = ["auto", "paper", "sepia", "night", "dark"];

function clampNumber(value, lo, hi, fallback) {
	const n = Number(value);
	if (!Number.isFinite(n)) return fallback;
	return Math.min(hi, Math.max(lo, n));
}

function normalizeTypography(input) {
	const src = typeof input === "object" && input !== null ? input : {};
	const preset = TYPO_PRESETS.includes(String(src.preset)) ? String(src.preset) : TYPO_DEFAULTS.preset;
	return {
		preset,
		lines: Math.round(clampNumber(src.lines, 6, 40, TYPO_DEFAULTS.lines)),
		chars: Math.round(clampNumber(src.chars, 16, 60, TYPO_DEFAULTS.chars)),
		lineHeight: Number(clampNumber(src.lineHeight, 1.2, 2.6, TYPO_DEFAULTS.lineHeight).toFixed(2)),
		font: TYPO_FONTS.includes(String(src.font)) ? String(src.font) : TYPO_DEFAULTS.font,
		indent: src.indent === undefined ? TYPO_DEFAULTS.indent : Boolean(src.indent),
		justify: src.justify === undefined ? TYPO_DEFAULTS.justify : Boolean(src.justify),
		theme: TYPO_THEMES.includes(String(src.theme)) ? String(src.theme) : TYPO_DEFAULTS.theme,
	};
}

function readTypography(config) {
	return normalizeTypography(config?.typography);
}

// ---------------------------------------------------------------------------
// Reading progress and per-book typography overrides.
//   progress:        { [bookId]: { chapter, page, ratio, updatedAt } }
//   bookTypography:  { [bookId]: typography }
// Kept in config.json so a restart resumes exactly where the reader stopped.
// ---------------------------------------------------------------------------

function normalizeProgress(input) {
	const src = typeof input === "object" && input !== null ? input : {};
	const chapter = Math.round(clampNumber(src.chapter, -1, 100000, -1));
	const page = Math.round(clampNumber(src.page, 0, 100000, 0));
	const ratio = Number(clampNumber(src.ratio, 0, 1, 0).toFixed(4));
	return { chapter, page, ratio, updatedAt: Date.now() };
}

function readProgress(config, id) {
	const map = config?.progress && typeof config.progress === "object" ? config.progress : {};
	const entry = map[id];
	if (!entry || typeof entry !== "object") return null;
	return normalizeProgress({ ...entry, updatedAt: entry.updatedAt });
}

function readBookTypography(config, id) {
	const map = config?.bookTypography && typeof config.bookTypography === "object" ? config.bookTypography : {};
	const entry = map[id];
	return entry && typeof entry === "object" ? normalizeTypography(entry) : null;
}

/** Effective typography for a book: its own override, else the global setting. */
function effectiveTypography(config, id) {
	return readBookTypography(config, id) || readTypography(config);
}

function readConfig() {
	try {
		// Strip a UTF-8 BOM if present: JSON.parse() rejects it, which would
		// silently reset the config (and the library path) to defaults.
		const raw = readFileSync(CONFIG_FILE, "utf8").replace(/^\uFEFF/, "");
		const value = JSON.parse(raw);
		return typeof value === "object" && value !== null ? value : {};
	} catch {
		return {};
	}
}

function writeConfig(patch) {
	const merged = { ...readConfig(), ...patch };
	try {
		mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
		writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf8");
	} catch {
		// Config persistence is best-effort.
	}
	return merged;
}

function libRoot(config) {
	return String(config?.libraryPath || DEFAULT_LIB);
}

function normalizeLibPath(input) {
	const raw = String(input || "").trim();
	if (!raw) throw new Error("libraryPath is required");
	return path.resolve(raw);
}

function samePath(a, b) {
	const pa = path.resolve(a);
	const pb = path.resolve(b);
	return process.platform === "win32" ? pa.toLowerCase() === pb.toLowerCase() : pa === pb;
}

function isInside(child, parent) {
	const c = path.resolve(child);
	const p = path.resolve(parent);
	return c === p || c.startsWith(p + path.sep);
}

/** Move every file from the old library root into a new one, preserving relative folders. */
function moveLibrary(oldRoot, newRoot) {
	const result = { moved: 0, skipped: 0, same: false, error: null };
	if (samePath(oldRoot, newRoot)) {
		result.same = true;
		return result;
	}
	try {
		mkdirSync(newRoot, { recursive: true });
	} catch (e) {
		result.error = "Cannot create target folder: " + String(e?.message || e);
		return result;
	}

	const files = [];
	const walk = (dir) => {
		let entries = [];
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (isInside(full, newRoot)) continue; // never walk into the destination if nested
			if (entry.isDirectory()) walk(full);
			else if (entry.isFile()) files.push(full);
		}
	};
	walk(oldRoot);

	for (const file of files) {
		const rel = path.relative(oldRoot, file);
		const dest = path.join(newRoot, rel);
		try {
			mkdirSync(path.dirname(dest), { recursive: true });
			if (existsSync(dest)) {
				result.skipped++;
				continue;
			}
			let done = false;
			try {
				renameSync(file, dest);
				done = true;
			} catch {
				// Cross-volume move: fall back to copy + delete.
				try {
					copyFileSync(file, dest);
					done = true;
					try { unlinkSync(file); } catch { /* leave source on failure */ }
				} catch { /* keep original */ }
			}
			if (done) result.moved++;
			else result.skipped++;
		} catch {
			result.skipped++;
		}
	}

	// Prune directories left empty in the old root (never touch the new root).
	if (!isInside(newRoot, oldRoot)) {
		const prune = (dir) => {
			let entries = [];
			try {
				entries = readdirSync(dir, { withFileTypes: true });
			} catch {
				return;
			}
			for (const entry of entries) {
				if (entry.isDirectory()) prune(path.join(dir, entry.name));
			}
			try {
				if (readdirSync(dir).length === 0 && !samePath(dir, newRoot)) rmdirSync(dir);
			} catch { /* not empty or protected */ }
		};
		prune(oldRoot);
	}
	return result;
}

function findPython(configured) {
	const candidates = [
		configured,
		process.env.BOOKS_PYTHON,
		path.join(homedir(), ".dsh", "dsh-runtimes", "dsh-primary-runtime", "dependencies", "python", "python.exe"),
		"python",
	].filter((item) => typeof item === "string" && item.length > 0);
	for (const candidate of candidates) {
		if (candidate === "python" || existsSync(candidate)) return candidate;
	}
	return "python";
}

function encodeId(root, absPath) {
	const rel = path.relative(root, absPath).split(path.sep).join("/");
	return Buffer.from(rel, "utf8").toString("base64url");
}

function decodeId(root, id) {
	let rel;
	try {
		rel = Buffer.from(String(id), "base64url").toString("utf8");
	} catch {
		throw new Error("Invalid book id");
	}
	const abs = path.resolve(root, rel);
	const normalizedRoot = path.resolve(root);
	if (abs !== normalizedRoot && !abs.startsWith(normalizedRoot + path.sep)) {
		throw new Error("Book id escapes the library folder");
	}
	return abs;
}

/** Ids hidden via "delete record only" — the file stays on disk but is not shown. */
function hiddenIds(config) {
	const h = config?.hiddenBooks;
	return new Set(Array.isArray(h) ? h.filter((x) => typeof x === "string") : []);
}

function scanLibrary(config) {
	const root = libRoot(config);
	const hidden = hiddenIds(config);
	const books = [];
	if (!existsSync(root)) return books;
	const walk = (dir) => {
		let entries = [];
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.isFile() && SUPPORTED.includes(path.extname(entry.name).toLowerCase())) {
				try {
					const st = statSync(full);
					const id = encodeId(root, full);
					if (hidden.has(id)) continue; // record deleted from the shelf; file kept on disk
					books.push({
						id,
						title: path.basename(entry.name, path.extname(entry.name)),
						author: "",
						format: path.extname(entry.name).toLowerCase().slice(1),
						size: st.size,
						modified: st.mtimeMs,
						// Relative folder of this book inside the library ("": root). Used for
						// automatic, path-based categories in the panel.
						folder: path.relative(root, path.dirname(full)).split(path.sep).join("/"),
					});
				} catch {
					// Skip unreadable files.
				}
			}
		}
	};
	walk(root);
	books.sort((a, b) => a.title.localeCompare(b.title, "zh"));
	return books;
}

// ---------------------------------------------------------------------------
// Categories: two sources.
//   1. "folder" categories — derived automatically from the directory layout
//      of the library on disk (every folder that directly or indirectly
//      contains a supported book becomes a category, keyed by its relative
//      path). The user never has to manage these.
//   2. "custom" categories — created/renamed/deleted by the user, stored in
//      config.json as { categories: [{id,name}], bookCategories: {bookId:[catId]} }.
//      A book may belong to several custom categories.
// ---------------------------------------------------------------------------

function readCategories(config) {
	const cats = Array.isArray(config?.categories) ? config.categories : [];
	const map = config?.bookCategories && typeof config.bookCategories === "object" ? config.bookCategories : {};
	return {
		categories: cats.filter((c) => c && typeof c.id === "string" && typeof c.name === "string"),
		bookCategories: map,
	};
}

/** Build the folder-based categories from the current library scan. */
function folderCategories(books) {
	const counts = new Map();
	for (const b of books) {
		const folder = String(b.folder || "");
		if (!folder) continue;
		counts.set(folder, (counts.get(folder) || 0) + 1);
	}
	return [...counts.entries()]
		.sort((a, b) => a[0].localeCompare(b[0], "zh"))
		.map(([id, count]) => ({ id: "folder:" + id, name: id, type: "folder", count }));
}

/** Categories response used by the panel: folder categories + custom categories, with book counts. */
function categoriesResponse(config, scannedBooks) {
	const books = scannedBooks || scanLibrary(config);
	const { categories, bookCategories } = readCategories(config);
	const folders = folderCategories(books);
	const custom = categories.map((c) => {
		let count = 0;
		for (const b of books) {
			const ids = bookCategories[b.id];
			if (Array.isArray(ids) && ids.includes(c.id)) count++;
		}
		return { ...c, type: "custom", count };
	});
	// Assign each book its custom category ids so the panel can filter locally.
	const booksWithCats = books.map((b) => ({
		...b,
		categories: Array.isArray(bookCategories[b.id]) ? bookCategories[b.id] : [],
	}));
	return { ok: true, categories: [...folders, ...custom], books: booksWithCats };
}

const extractCache = new Map();

// Include the extractor's own mtime in the cache key so that editing
// extractor.py automatically invalidates every cached extraction.
function extractorStamp() {
	try { return String(statSync(EXTRACTOR).mtimeMs); } catch { return ""; }
}

function extractBook(config, id) {
	const root = libRoot(config);
	const abs = decodeId(root, id);
	if (!existsSync(abs)) throw new Error("Book file not found");
	let st;
	try {
		st = statSync(abs);
	} catch {
		st = null;
	}
	const cacheKey = abs + "|" + (st ? st.mtimeMs : "") + "|" + extractorStamp();
	// L1: in-memory cache (fastest).
	if (extractCache.has(cacheKey)) return extractCache.get(cacheKey);
	// L2: persistent disk cache — survives Host reloads and app restarts, so a
	// book is only ever run through Python once until the file/extractor changes.
	const digest = createHash("sha256").update(cacheKey).digest("hex").slice(0, 32);
	const cacheFile = path.join(EXTRACT_CACHE_DIR, digest.slice(0, 2), digest + ".json");
	if (existsSync(cacheFile)) {
		try {
			const cached = JSON.parse(readFileSync(cacheFile, "utf8"));
			cached.id = id;
			extractCache.set(cacheKey, cached);
			return cached;
		} catch { /* corrupt cache file — fall through to re-extract */ }
	}

	const python = findPython(config.python);
	const r = spawnSync(python, ["-u", EXTRACTOR, abs], {
		encoding: "utf8",
		maxBuffer: 128 * 1024 * 1024,
		windowsHide: true,
		env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
	});
	if (r.error) throw r.error;
	let result;
	try {
		result = JSON.parse(r.stdout.trim().split(/\r?\n/).pop() || "{}");
	} catch {
		throw new Error("Extractor returned invalid JSON: " + (r.stderr || r.stdout || "").slice(0, 500));
	}
	if (r.status !== 0 && !result.title && !result.chapters) {
		throw new Error("Extractor failed: " + (r.stderr || "").slice(0, 500));
	}
	result.id = id;
	extractCache.set(cacheKey, result);
	try {
		mkdirSync(path.dirname(cacheFile), { recursive: true });
		writeFileSync(cacheFile, JSON.stringify(result), "utf8");
	} catch { /* disk cache is best-effort */ }
	return result;
}

/**
 * Full-text search inside one book. Works off the cached extraction, so a book
 * is never re-parsed just to look for a word. Returns at most `limit` hits,
 * each carrying its chapter index (so the panel can jump there) plus a short
 * context snippet.
 */
function searchBook(book, query, limit) {
	const needle = String(query || "").toLowerCase();
	const chapters = Array.isArray(book?.chapters) ? book.chapters : [];
	const matches = [];
	for (let ci = 0; ci < chapters.length && matches.length < limit; ci++) {
		const text = String(chapters[ci]?.text || "");
		if (!text) continue;
		const lower = text.toLowerCase();
		let at = lower.indexOf(needle);
		while (at >= 0 && matches.length < limit) {
			const from = Math.max(0, at - 24);
			const to = Math.min(text.length, at + needle.length + 36);
			matches.push({
				chapter: ci,
				heading: String(chapters[ci]?.heading || ""),
				offset: at,
				snippet: (from > 0 ? "…" : "") + text.slice(from, to).replace(/\s+/g, " ").trim() + (to < text.length ? "…" : ""),
			});
			at = lower.indexOf(needle, at + needle.length);
		}
	}
	return { ok: true, query, total: matches.length, truncated: matches.length >= limit, matches };
}

/** Render one page of a (scanned) PDF to a cached PNG; return the file path. */
function renderPage(config, id, pageNo, zoom) {
	const root = libRoot(config);
	const abs = decodeId(root, id);
	if (!existsSync(abs)) throw new Error("Book file not found");
	if (path.extname(abs).toLowerCase() !== ".pdf") throw new Error("Page rendering is only available for PDFs");
	let st;
	try { st = statSync(abs); } catch { st = null; }
	let p = Number(pageNo);
	if (!Number.isFinite(p) || p < 0) p = 0;
	p = Math.floor(p);
	let z = Number(zoom);
	if (!Number.isFinite(z) || z <= 0) z = 1.4;
	z = Math.min(4, Math.max(0.4, z));
	const stamp = extractorStamp();
	const key = abs + "|" + (st ? st.mtimeMs : "") + "|" + stamp + "|" + p + "|" + z;
	const digest = createHash("sha256").update(key).digest("hex").slice(0, 32);
	const outDir = path.join(PAGE_CACHE, digest.slice(0, 2));
	const out = path.join(outDir, digest + ".png");
	if (existsSync(out)) return out;
	const python = findPython(config.python);
	const r = spawnSync(python, ["-u", RENDERER, abs, String(p), out, String(z)], {
		encoding: "utf8",
		maxBuffer: 16 * 1024 * 1024,
		windowsHide: true,
		env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
	});
	if (r.error) throw r.error;
	if (!existsSync(out)) throw new Error("Page render failed: " + (r.stderr || r.stdout || "").slice(0, 300));
	return out;
}

function importPaths(state, paths) {
	const config = state.getConfig();
	const root = libRoot(config);
	mkdirSync(root, { recursive: true });
	const added = [];
	const failed = [];
	const unhide = new Set();
	for (const raw of paths) {
		const src = String(raw || "").trim();
		if (!src) continue;
		try {
			const abs = path.resolve(src);
			if (!existsSync(abs) || !statSync(abs).isFile()) {
				failed.push({ path: src, error: "Not a file" });
				continue;
			}
			if (!SUPPORTED.includes(path.extname(abs).toLowerCase())) {
				failed.push({ path: src, error: "Unsupported format" });
				continue;
			}
			const dest = path.join(root, path.basename(abs));
			copyFileSync(abs, dest);
			added.push(path.basename(abs));
			unhide.add(encodeId(root, dest));
		} catch (e) {
			failed.push({ path: src, error: String(e?.message || e) });
		}
	}
	// Re-importing a previously hidden book makes it visible again.
	if (unhide.size) {
		const h = hiddenIds(config);
		for (const id of unhide) h.delete(id);
		state.applyConfig({ hiddenBooks: [...h] }, false);
	}
	return { added, failed, books: scanLibrary(state.getConfig()) };
}

/**
 * Delete a book from the shelf.
 *   mode = "record" — hide it from the library by id; the file on disk is kept.
 *   mode = "file"   — also delete the physical file (and prune empty folders).
 * Both modes also clear the book's category assignments and image/extract caches.
 */
function deleteBook(state, id, mode) {
	const conf = state.getConfig();
	const root = libRoot(conf);
	const bookId = String(id || "");
	if (!bookId) throw new Error("A book id is required");
	const abs = decodeId(root, bookId);
	// Reject ids that do not point at a real file inside the library: otherwise a stale
	// or forged id would silently pile up entries in hiddenBooks and never hide anything.
	if (!existsSync(abs) || !isInside(abs, root) || samePath(abs, root)) {
		throw new Error("Book file not found");
	}
	const hidden = hiddenIds(conf);
	const nextHidden = new Set(hidden);
	nextHidden.add(bookId);

	if (mode === "file") {
		unlinkSync(abs);
		// Prune empty parent folders up to (but not including) the library root.
		let dir = path.dirname(abs);
		while (isInside(dir, root) && !samePath(dir, root)) {
			try {
				if (readdirSync(dir).length > 0) break;
				rmdirSync(dir);
			} catch { break; }
			dir = path.dirname(dir);
		}
	}

	// Clear category assignments for this book.
	const { categories, bookCategories } = readCategories(conf);
	const nextMap = { ...bookCategories };
	delete nextMap[bookId];

	state.applyConfig({ hiddenBooks: [...nextHidden], bookCategories: nextMap }, false);
	const updated = state.getConfig();
	return { ok: true, mode, deletedFileName: path.basename(abs), fileGone: !existsSync(abs), books: scanLibrary(updated) };
}

/** Mutate custom categories in config; returns the updated categories view. */
function mutateCategories(state, action, payload) {
	const conf = state.getConfig();
	const { categories, bookCategories } = readCategories(conf);
	const nextCats = categories.map((c) => ({ ...c }));
	const nextMap = { ...bookCategories };

	if (action === "create") {
		const name = String(payload?.name || "").trim();
		if (!name) throw new Error("Category name is required");
		if (nextCats.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
			throw new Error("A category with that name already exists");
		}
		const id = "custom:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
		nextCats.push({ id, name });
	} else if (action === "rename") {
		const id = String(payload?.id || "");
		const name = String(payload?.name || "").trim();
		if (!name) throw new Error("Category name is required");
		const cat = nextCats.find((c) => c.id === id);
		if (!cat) throw new Error("Category not found");
		if (nextCats.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
			throw new Error("A category with that name already exists");
		}
		cat.name = name;
	} else if (action === "delete") {
		const id = String(payload?.id || "");
		if (!nextCats.some((c) => c.id === id)) throw new Error("Category not found");
		const idx = nextCats.findIndex((c) => c.id === id);
		if (idx >= 0) nextCats.splice(idx, 1);
		for (const key of Object.keys(nextMap)) {
			if (Array.isArray(nextMap[key])) nextMap[key] = nextMap[key].filter((x) => x !== id);
		}
	} else if (action === "assign") {
		const bookId = String(payload?.bookId || "");
		const ids = Array.isArray(payload?.categories) ? payload.categories.filter((x) => typeof x === "string" && x.startsWith("custom:")) : [];
		if (!bookId) throw new Error("bookId is required");
		// Only allow ids that still exist, so deleted categories never linger.
		const valid = new Set(nextCats.map((c) => c.id));
		nextMap[bookId] = ids.filter((x) => valid.has(x));
	} else {
		throw new Error("Unknown category action: " + action);
	}

	state.applyConfig({ categories: nextCats, bookCategories: nextMap }, false);
	return categoriesResponse(state.getConfig());
}

function jsonResponse(value, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
	});
}

async function handleApi(request, state) {
	const url = new URL(request.url);
	const p = url.pathname;
	const method = request.method;
	const config = state.getConfig();

	if (p === "/api/books/bootstrap" && method === "GET") {
		// One scan, one round-trip: everything the panel needs on initial load.
		const books = scanLibrary(config);
		const view = categoriesResponse(config, books);
		const libraryPath = libRoot(config);
		return jsonResponse({
			ok: true,
			libraryPath, defaultLibraryPath: DEFAULT_LIB,
			isCustom: !samePath(libraryPath, DEFAULT_LIB),
			// Attach the saved reading position so the shelf can show progress
			// badges without a second request.
			books: view.books.map((b) => ({
				...b,
				progress: readProgress(config, b.id),
				hasTypography: Boolean(config?.bookTypography && config.bookTypography[b.id]),
			})),
			categories: view.categories,
			typography: readTypography(config),
		});
	}
	if (p === "/api/books/status" && method === "GET") {
		const libraryPath = libRoot(config);
		return jsonResponse({
			ok: true, libraryPath, defaultLibraryPath: DEFAULT_LIB,
			isCustom: !samePath(libraryPath, DEFAULT_LIB),
			python: findPython(config.python), books: scanLibrary(config).length,
		});
	}
	if (p === "/api/books/list" && method === "GET") {
		return jsonResponse({ ok: true, books: scanLibrary(config), libraryPath: libRoot(config), defaultLibraryPath: DEFAULT_LIB });
	}
	if (p === "/api/books/read" && method === "GET") {
		const id = url.searchParams.get("id") || "";
		try {
			// The saved position and the book's effective typography travel with
			// the text so opening a book resumes exactly where it stopped.
			return jsonResponse({
				ok: true,
				book: extractBook(config, id),
				progress: readProgress(config, id),
				typography: effectiveTypography(config, id),
			});
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	if (p === "/api/books/progress" && method === "POST") {
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
		}
		const id = String(body?.id || "");
		try {
			decodeId(libRoot(config), id); // reject ids that do not resolve to a file
		} catch {
			return jsonResponse({ ok: false, error: "Book file not found" }, 400);
		}
		const entry = normalizeProgress(body);
		const map = { ...(config.progress && typeof config.progress === "object" ? config.progress : {}) };
		map[id] = entry;
		state.applyConfig({ progress: map }, false);
		return jsonResponse({ ok: true, progress: entry });
	}
	if (p === "/api/books/search" && method === "GET") {
		const id = url.searchParams.get("id") || "";
		const q = (url.searchParams.get("q") || "").trim();
		const limit = Math.round(clampNumber(url.searchParams.get("limit"), 1, 200, 60));
		if (!q) return jsonResponse({ ok: false, error: "Empty query" }, 400);
		try {
			return jsonResponse(searchBook(extractBook(config, id), q, limit));
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	if (p === "/api/books/page" && method === "GET") {
		const id = url.searchParams.get("id") || "";
		const pageNo = url.searchParams.get("page") || "0";
		const zoom = url.searchParams.get("zoom") || "1.4";
		try {
			const png = renderPage(config, id, pageNo, zoom);
			const bytes = readFileSync(png);
			return new Response(bytes, {
				status: 200,
				headers: {
					"content-type": "image/png",
					"cache-control": "public, max-age=86400",
					"content-length": String(bytes.length),
				},
			});
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	if (p === "/api/books/categories" && method === "GET") {
		return jsonResponse(categoriesResponse(config));
	}
	if (p === "/api/books/categories" && method === "POST") {
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
		}
		try {
			return jsonResponse(mutateCategories(state, String(body?.action || ""), body));
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	if (p === "/api/books/config" && method === "GET") {
		const libraryPath = libRoot(config);
		return jsonResponse({
			ok: true, libraryPath, defaultLibraryPath: DEFAULT_LIB,
			isCustom: !samePath(libraryPath, DEFAULT_LIB),
			typography: readTypography(config),
		});
	}
	if (p === "/api/books/config" && method === "POST") {
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
		}
		// Typography and library location are saved independently: the panel
		// posts {typography} while changing layout, and {libraryPath} or
		// {reset} while changing where books live.
		if (body?.typography) {
			state.applyConfig({ typography: normalizeTypography(body.typography) }, false);
		}
		if (body?.bookTypography && typeof body.bookTypography === "object") {
			// Per-book overrides, e.g. { bookTypography: { <id>: typography } }.
			const cur = state.getConfig();
			const map = cur.bookTypography && typeof cur.bookTypography === "object" ? { ...cur.bookTypography } : {};
			for (const [bid, value] of Object.entries(body.bookTypography)) {
				if (value === null) delete map[bid];
				else map[bid] = normalizeTypography(value);
			}
			state.applyConfig({ bookTypography: map }, false);
		}
		let moveResult = null;
		if (body?.reset || body?.libraryPath) {
			const target = body?.reset ? DEFAULT_LIB : normalizeLibPath(body?.libraryPath);
			const move = body?.move !== false;
			moveResult = state.applyConfig({ libraryPath: target }, move);
		}
		const updated = state.getConfig();
		return jsonResponse({
			ok: true, libraryPath: libRoot(updated), defaultLibraryPath: DEFAULT_LIB,
			isCustom: !samePath(libRoot(updated), DEFAULT_LIB),
			books: moveResult ? scanLibrary(updated) : undefined,
			move: moveResult,
			typography: readTypography(updated),
		});
	}
	if (p === "/api/books/import" && method === "POST") {
		const contentType = request.headers.get("content-type") || "";
		try {
			if (contentType.includes("application/json")) {
				const body = await request.json();
				const paths = Array.isArray(body?.paths) ? body.paths : (body?.path ? [body.path] : []);
				return jsonResponse({ ok: true, ...importPaths(state, paths) });
			}
			const form = await request.formData();
			const root = libRoot(config);
			mkdirSync(root, { recursive: true });
			const added = [];
			const failed = [];
			const unhide = new Set();
			for (const [name, value] of form.entries()) {
				if (typeof value === "string") continue;
				try {
					const buf = Buffer.from(await value.arrayBuffer());
					const fileName = path.basename(value.name || name || "book.bin");
					if (!SUPPORTED.includes(path.extname(fileName).toLowerCase())) {
						failed.push({ path: fileName, error: "Unsupported format" });
						continue;
					}
					writeFileSync(path.join(root, fileName), buf);
					added.push(fileName);
					unhide.add(encodeId(root, path.join(root, fileName)));
				} catch (e) {
					failed.push({ path: name, error: String(e?.message || e) });
				}
			}
			if (unhide.size) {
				const h = hiddenIds(config);
				for (const id of unhide) h.delete(id);
				state.applyConfig({ hiddenBooks: [...h] }, false);
			}
			return jsonResponse({ ok: true, added, failed, books: scanLibrary(state.getConfig()) });
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	if (p === "/api/books/delete" && method === "POST") {
		let body;
		try {
			body = await request.json();
		} catch {
			return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
		}
		try {
			const mode = body?.mode === "file" ? "file" : "record";
			return jsonResponse(deleteBook(state, String(body?.id || ""), mode));
		} catch (e) {
			return jsonResponse({ ok: false, error: String(e?.message || e) }, 400);
		}
	}
	// ---- Library source index (public libraries open/public-domain collections) ----
	// Read-only: lists sources from the dsh-library-sources weekly index. The UI
	// uses this to offer a multi-library switcher; adapters are added over time.
	if (p === "/api/books/sources" && method === "GET") {
		try {
			const force = url.searchParams.get("force") === "1";
			return jsonResponse(await sources.librarySources(force));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	// ---- National Library of China (public-domain Republican gazetteers) ----
	// These are read-only browsing proxies. Nothing is written to the local shelf.
	if (p === "/api/books/nlc/catalog" && method === "GET") {
		try {
			return jsonResponse(await nlc.nlcCatalog(url.searchParams.get("page") || 1, url.searchParams.get("rows") || 20));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/nlc/search" && method === "GET") {
		try {
			return jsonResponse(await nlc.nlcSearch(url.searchParams.get("q") || "", url.searchParams.get("page") || 1, url.searchParams.get("rows") || 30));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/nlc/meta" && method === "GET") {
		try {
			return jsonResponse(await nlc.nlcBookMeta(url.searchParams.get("sourceId") || "", url.searchParams.get("volume") || "001"));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/nlc/page" && method === "GET") {
		try {
			return jsonResponse(await nlc.nlcPage(
				url.searchParams.get("sourceId") || "", url.searchParams.get("volume") || "001",
				url.searchParams.get("page") || 1,
			));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/nlc/image" && method === "GET") {
		try {
			const bytes = await nlc.nlcImage(url.searchParams.get("file") || "");
			return new Response(bytes, {
				status: 200,
				headers: {
					"content-type": "image/jpeg",
					"cache-control": "public, max-age=86400",
					"content-length": String(bytes.length),
				},
			});
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	// ---- Guangdong provincial library (open OCR text of 广东通志) ----
	// Read-only, text-only browsing. Nothing is written to the local shelf.
	if (p === "/api/books/gd/catalog" && method === "GET") {
		try {
			return jsonResponse(await gd.gdCatalog(url.searchParams.get("page") || 1, url.searchParams.get("rows") || 100));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/gd/search" && method === "GET") {
		try {
			return jsonResponse(await gd.gdSearch(url.searchParams.get("q") || "", url.searchParams.get("page") || 1, url.searchParams.get("rows") || 100));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/gd/meta" && method === "GET") {
		try {
			return jsonResponse(await gd.gdBookMeta(url.searchParams.get("treeId") || ""));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/gd/page" && method === "GET") {
		try {
			return jsonResponse(await gd.gdPage(
				url.searchParams.get("treeId") || "", url.searchParams.get("page") || 1,
			));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/sx/catalog" && method === "GET") {
		try {
			return jsonResponse(await sx.sxCatalog(url.searchParams.get("page") || 1, url.searchParams.get("rows") || 100));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/sx/search" && method === "GET") {
		try {
			return jsonResponse(await sx.sxSearch(url.searchParams.get("q") || "", url.searchParams.get("page") || 1, url.searchParams.get("rows") || 100));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/sx/meta" && method === "GET") {
		try {
			return jsonResponse(await sx.sxBookMeta(url.searchParams.get("wholeId") || ""));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/sx/page" && method === "GET") {
		try {
			return jsonResponse(await sx.sxPage(
				url.searchParams.get("wholeId") || "", url.searchParams.get("volumeId") || "",
				url.searchParams.get("page") || 1,
			));
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	if (p === "/api/books/sx/image" && method === "GET") {
		try {
			const bytes = await sx.sxImage(url.searchParams.get("file") || "");
			return new Response(bytes, {
				status: 200,
				headers: {
					"content-type": "image/jpeg",
					"cache-control": "public, max-age=86400",
					"content-length": String(bytes.length),
				},
			});
		} catch (e) { return jsonResponse({ ok: false, error: String(e?.message || e) }, 400); }
	}
	return jsonResponse({ ok: false, error: "Unknown route" }, 404);
}

const TOOL_PARAMETERS = {
	type: "object",
	additionalProperties: false,
	properties: {
		action: { type: "string", enum: ["list", "read", "add", "setpath", "delete"], description: "list: show library books and current location; read: extract a book's text; add: copy local file paths into the library; setpath: change the library location (optionally moving existing books); delete: remove a book from the shelf (mode=record hides it, mode=file also deletes the local file)." },
		id: { type: "string", description: "Book id from list (required for read/delete)." },
		paths: { type: "array", items: { type: "string" }, description: "Local file paths to import (required for add)." },
		chapter: { type: "integer", description: "Optional 1-based chapter index for read; omit to read all." },
		path: { type: "string", description: "New library folder path (required for setpath)." },
		move: { type: "boolean", description: "For setpath: move existing files into the new folder (default true)." },
		mode: { type: "string", enum: ["record", "file"], description: "For delete: record hides the shelf entry (keeps the file); file also deletes the local file (default record)." },
	},
	required: ["action"],
};

const TOOL_OUTPUT = {
	schema: {
		type: "object",
		additionalProperties: false,
		properties: {
			ok: { type: "boolean" },
			text: { type: "string" },
		},
		required: ["ok", "text"],
	},
	render: (_args, value) => [{ type: "text", text: String(value?.text || "") }],
};

export function apply(ctx) {
	// Mutable so that config changes are visible to every route and tool.
	let config = readConfig();
	const state = {
		getConfig: () => config,
		applyConfig(patch, move) {
			const oldRoot = libRoot(config);
			const target = patch.libraryPath ? normalizeLibPath(patch.libraryPath) : oldRoot;
			let moveResult = null;
			if (move && !samePath(oldRoot, target)) moveResult = moveLibrary(oldRoot, target);
			config = writeConfig({ ...patch, libraryPath: target });
			return moveResult;
		},
	};

	// The connection service may not exist yet when this plugin is applied during a
	// cold start (plugin load order is not guaranteed). Register immediately when it
	// is available, otherwise wait for it instead of silently giving up — a silently
	// skipped registration made every /api/books/* route 404 until the plugin was
	// toggled off and on again.
	ctx.effect(() => {
		let stopped = false;
		const disposers = [];
		let registered = false;

		const registerRoutes = () => {
			if (registered || stopped) return true;
			const connection = ctx.get("connection");
			if (!connection?.fetch?.register) return false;
			const routes = ["bootstrap", "status", "list", "read", "page", "config", "import", "categories", "delete", "progress", "search", "sources", "nlc/catalog", "nlc/search", "nlc/meta", "nlc/page", "nlc/image", "gd/catalog", "gd/search", "gd/meta", "gd/page", "sx/catalog", "sx/search", "sx/meta", "sx/page", "sx/image"].map((name) =>
				connection.fetch.register({
					path: "/api/books/" + name,
					methods: ["GET", "POST"],
					requestBody: "buffered",
					fetch: (request) => handleApi(request, state),
				}),
			);
			disposers.push(...routes);
			registered = true;
			return true;
		};

		if (!registerRoutes()) {
			ctx.logger?.info?.("[books] waiting for the connection service to register /api/books/* routes");
			// React as soon as the service shows up (cordis emits this when a service is provided).
			const unsubscribe = ctx.on?.("internal/service", () => registerRoutes());
			if (typeof unsubscribe === "function") disposers.push(unsubscribe);
			// Belt and braces: poll briefly in case the event name differs in this build.
			let attempts = 0;
			const timer = setInterval(() => {
				attempts += 1;
				if (registerRoutes() || attempts > 120) clearInterval(timer);
			}, 500);
			if (timer.unref) timer.unref();
			disposers.push(() => clearInterval(timer));
		}

		return () => {
			stopped = true;
			const pending = disposers.splice(0);
			return Promise.allSettled(pending.map((dispose) => (typeof dispose === "function" ? dispose() : dispose)));
		};
	}, "books /api routes");

	ctx.effect(() => ctx.tools.register({
		name: "books",
		description: "Read and manage the local book library (TXT/EPUB/PDF/AZW3). Use action=list to see books, their ids and the current library location; action=read with an id to extract the book's text (optionally one chapter); action=add with paths to import files; action=setpath with a path to change the library location and move existing books; action=delete with an id (and mode=record|file) to remove a book. This is the same library shown in the Books sidebar panel.",
		parameters: TOOL_PARAMETERS,
		output: TOOL_OUTPUT,
		timeoutMs: 180000,
		async execute(args) {
			const action = String(args.action || "list");
			const conf = state.getConfig();
			if (action === "list") {
				const books = scanLibrary(conf);
				const view = categoriesResponse(conf);
				const catLine = view.categories.length
					? "\nCategories: " + view.categories.map((c) => `${c.name}(${c.type},${c.count})`).join(", ")
					: "";
				return { ok: true, text: `Library: ${libRoot(conf)}${catLine}\n` + (books.length === 0
					? "The book library is empty."
					: books.map((b, i) => `${i + 1}. [${b.id}] ${b.title} (${b.format}, ${Math.round(b.size / 1024)} KB${b.folder ? ", folder=" + b.folder : ""})`).join("\n")) };
			}
			if (action === "read") {
				if (!args.id) throw new Error("action=read requires an id (use action=list first)");
				const book = extractBook(conf, String(args.id));
				let text = `《${book.title || "Untitled"}》${book.author ? " — " + book.author : ""}\n\n`;
				const chapters = args.chapter
					? [book.chapters[Number(args.chapter) - 1]].filter(Boolean)
					: book.chapters;
				if (!chapters.length) {
					if (book.mode === "images") {
						text += `This is an image-only (scanned) PDF with ${book.pageCount || 0} pages and no text layer. It cannot be read as text; use the Books panel to view it page by page.`;
					} else {
						text += book.warning || "No text extracted.";
					}
				}
				for (const ch of chapters) text += `\n## ${ch.heading}\n\n${ch.text}\n`;
				return { ok: true, text: text.slice(0, 200000) };
			}
			if (action === "add") {
				const paths = Array.isArray(args.paths) ? args.paths : (args.path ? [args.path] : []);
				if (!paths.length) throw new Error("action=add requires paths");
				const outcome = importPaths(state, paths);
				return { ok: true, text: `Added ${outcome.added.length} file(s): ${outcome.added.join(", ")}${outcome.failed.length ? "\nFailed: " + outcome.failed.map((f) => f.path + ": " + f.error).join("; ") : ""}` };
			}
			if (action === "setpath") {
				const raw = args.path || args.libraryPath;
				if (!raw) throw new Error("action=setpath requires a path");
				const target = normalizeLibPath(raw);
				const mv = state.applyConfig({ libraryPath: target }, args.move !== false);
				const detail = mv && !mv.same
					? ` Moved ${mv.moved} file(s), skipped ${mv.skipped}${mv.error ? "; error: " + mv.error : ""}.`
					: "";
				return { ok: true, text: `Library location set to ${target}.${detail}` };
			}
			if (action === "delete") {
				if (!args.id) throw new Error("action=delete requires an id (use action=list first)");
				const mode = args.mode === "file" ? "file" : "record";
				const outcome = deleteBook(state, String(args.id), mode);
				return { ok: true, text: mode === "file"
					? `Deleted ${outcome.deletedFileName} from the shelf and disk (file gone: ${outcome.fileGone}).`
					: `Removed ${outcome.deletedFileName} from the shelf; the file is kept on disk.` };
			}
			throw new Error("Unknown action: " + action);
		},
	}), "books agent tool");

	ctx.logger?.info?.("[books] ready: library=" + libRoot(config));
}

export { inject };
