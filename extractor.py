#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract readable text from a book file into a JSON payload on stdout.

Usage:
    python extractor.py <path-to-book>

Output (stdout, single JSON object):
    {
      "title": str,
      "author": str,
      "format": "txt"|"epub"|"pdf"|"azw3",
      "chapters": [ {"heading": str, "text": str}, ... ],
      "warning": str (optional)
    }

Supported formats:
    .txt   -- BOM sniffing, then utf-8 (strict), then gb18030.
    .epub  -- ebooklib spine order, HTML stripped to text.
    .pdf   -- pypdf text extraction (page per chapter).
    .azw3  -- `mobi` extraction to a temp EPUB/HTML, then parsed as EPUB/HTML.

DRM-protected books are not supported. Scanned PDFs yield no text; a warning
is added in that case.
"""

import json
import os
import re
import shutil
import sys
import tempfile
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# HTML -> text helper
# ---------------------------------------------------------------------------

class _TextHTMLParser(HTMLParser):
    """Collect visible text from HTML, skipping script/style/head elements."""

    _SKIP = {"script", "style", "head", "meta", "link"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0
        self.heading_stack = []
        self.headings = []

    def handle_starttag(self, tag, attrs):
        if tag in self._SKIP:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if re.fullmatch(r"h[1-6]", tag or ""):
            self.heading_stack.append([])
        if tag in ("p", "div", "br", "li", "h1", "h2", "h3", "h4", "h5", "h6"):
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in self._SKIP:
            if self.skip_depth:
                self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if re.fullmatch(r"h[1-6]", tag or ""):
            if self.heading_stack:
                text = "".join(self.heading_stack.pop()).strip()
                if text:
                    self.headings.append(text)
        if tag in ("p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6"):
            self.parts.append("\n")

    def handle_data(self, data):
        if self.skip_depth:
            return
        self.parts.append(data)
        if self.heading_stack:
            self.heading_stack[-1].append(data)

    def text(self):
        raw = "".join(self.parts)
        # collapse horizontal whitespace, keep paragraph newlines
        lines = []
        for line in raw.splitlines():
            cleaned = re.sub(r"[ \t\u00a0]+", " ", line).strip()
            if cleaned:
                lines.append(cleaned)
        return "\n".join(lines)


def html_to_text(html: str):
    parser = _TextHTMLParser()
    try:
        parser.feed(html)
        parser.close()
    except Exception:
        # Malformed HTML: fall back to a crude tag strip.
        text = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", html)
        text = re.sub(r"(?s)<[^>]+>", " ", text)
        return _collapse(text), []
    return parser.text(), parser.headings


def _collapse(text: str) -> str:
    lines = []
    for line in text.splitlines():
        cleaned = re.sub(r"[ \t\u00a0]+", " ", line).strip()
        if cleaned:
            lines.append(cleaned)
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Per-format extractors
# ---------------------------------------------------------------------------

def extract_txt(path):
    with open(path, "rb") as fh:
        raw = fh.read()
    if raw.startswith(b"\xef\xbb\xbf"):
        text = raw[3:].decode("utf-8", errors="replace")
    elif raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        text = raw.decode("utf-16", errors="replace")
    else:
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            try:
                text = raw.decode("gb18030")
            except UnicodeDecodeError:
                text = raw.decode("utf-8", errors="replace")
    # Split on blank lines; keep chapters reasonably sized.
    blocks = re.split(r"\n\s*\n+", text.strip())
    if len(blocks) <= 1:
        # No blank-line separators: split into ~3000 char chunks.
        blocks = [text[i:i + 3000] for i in range(0, len(text), 3000)]
    chapters = []
    for i, block in enumerate(blocks, 1):
        block = block.strip()
        if block:
            chapters.append({"heading": "第 %d 部分" % i, "text": _collapse(block)})
    return {"title": os.path.splitext(os.path.basename(path))[0],
            "author": "", "chapters": chapters}


def _epub_to_result(book, chapters_wanted=None):
    from ebooklib import epub
    title = ""
    author = ""
    try:
        metadata = book.get_metadata("DC", "title")
        if metadata:
            title = metadata[0][0]
    except Exception:
        pass
    try:
        metadata = book.get_metadata("DC", "creator")
        if metadata:
            author = metadata[0][0]
    except Exception:
        pass

    chapters = []
    # NOTE: ITEM_DOCUMENT is defined on the `ebooklib` package, NOT on
    # `ebooklib.epub`. Using epub.ITEM_DOCUMENT raises AttributeError in
    # ebooklib 0.21+ and makes every EPUB/AZW3 appear to have no text.
    from ebooklib import ITEM_DOCUMENT
    for item in book.get_items_of_type(ITEM_DOCUMENT):
        try:
            html = item.get_content().decode("utf-8", errors="replace")
        except Exception:
            continue
        text, headings = html_to_text(html)
        if not text.strip():
            continue
        heading = headings[0] if headings else (item.get_name() or "")
        chapters.append({"heading": heading.strip(), "text": text})
        if chapters_wanted and len(chapters) >= chapters_wanted:
            break
    return {"title": title, "author": author, "chapters": chapters}


def extract_epub(path):
    from ebooklib import epub
    book = epub.read_epub(path)
    return _epub_to_result(book)


def extract_pdf(path):
    from pypdf import PdfReader
    reader = PdfReader(path)
    meta = reader.metadata or {}
    title = meta.get("/Title") or ""
    author = meta.get("/Author") or ""
    if isinstance(title, bytes):
        title = title.decode("utf-8", errors="replace")
    if isinstance(author, bytes):
        author = author.decode("utf-8", errors="replace")
    chapters = []
    page_count = len(reader.pages)
    for i, page in enumerate(reader.pages, 1):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        text = _collapse(text)
        if text:
            chapters.append({"heading": "第 %d 页" % i, "text": text})
    result = {"title": title, "author": author, "chapters": chapters}
    if not chapters:
        # Image-only (scanned) PDF: no text layer to extract. Flag it so the
        # reader can switch to page-by-page image rendering instead.
        result["mode"] = "images"
        result["pageCount"] = page_count
        result["warning"] = "No extractable text found (scanned image PDF?)"
    return result


def extract_azw3(path):
    import mobi
    tempdir, filepath = mobi.extract(path)
    result = None
    try:
        if os.path.isdir(filepath):
            # mobi.extract may return a directory containing an EPUB or HTML.
            epubs = []
            htmls = []
            for root, _dirs, files in os.walk(filepath):
                for name in files:
                    lower = name.lower()
                    full = os.path.join(root, name)
                    if lower.endswith(".epub"):
                        epubs.append(full)
                    elif lower.endswith((".html", ".htm")):
                        htmls.append(full)
            if epubs:
                from ebooklib import epub
                result = _epub_to_result(epub.read_epub(epubs[0]))
            elif htmls:
                with open(htmls[0], "r", encoding="utf-8", errors="replace") as fh:
                    html = fh.read()
                text, headings = html_to_text(html)
                result = {"title": os.path.splitext(os.path.basename(path))[0],
                          "author": "",
                          "chapters": [{"heading": headings[0] if headings else "正文",
                                        "text": text}] if text.strip() else []}
        elif filepath.lower().endswith((".epub", ".azw3", ".mobi")):
            from ebooklib import epub
            result = _epub_to_result(epub.read_epub(filepath))
        elif filepath.lower().endswith((".html", ".htm")):
            with open(filepath, "r", encoding="utf-8", errors="replace") as fh:
                html = fh.read()
            text, headings = html_to_text(html)
            result = {"title": os.path.splitext(os.path.basename(path))[0],
                      "author": "",
                      "chapters": [{"heading": headings[0] if headings else "正文",
                                    "text": text}] if text.strip() else []}
        elif filepath.lower().endswith(".pdf"):
            result = extract_pdf(filepath)
    finally:
        try:
            shutil.rmtree(tempdir)
        except Exception:
            pass
    if result is None:
        result = {"title": os.path.splitext(os.path.basename(path))[0],
                  "author": "", "chapters": []}
    if not result.get("chapters"):
        result["warning"] = "No extractable text found (DRM-protected?)"
    return result


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: extractor.py <path>"}))
        sys.exit(2)
    path = sys.argv[1]
    ext = os.path.splitext(path)[1].lower()
    try:
        if ext == ".txt":
            result = extract_txt(path)
        elif ext == ".epub":
            result = extract_epub(path)
        elif ext == ".pdf":
            result = extract_pdf(path)
        elif ext in (".azw3", ".mobi", ".azw"):
            result = extract_azw3(path)
        else:
            result = {"error": "Unsupported format: %s" % ext,
                      "title": os.path.basename(path), "author": "", "chapters": []}
    except Exception as exc:
        result = {"title": os.path.splitext(os.path.basename(path))[0],
                  "author": "", "chapters": [],
                  "warning": "Extraction failed: %s: %s" % (type(exc).__name__, exc)}
    result.setdefault("title", "")
    result.setdefault("author", "")
    result.setdefault("chapters", [])
    result.setdefault("format", ext.lstrip("."))
    # ensure_ascii=True keeps stdout pure ASCII: Windows Python's stdout uses
    # the console codepage (GBK here), so raw non-ASCII would be mojibake.
    # JSON.parse on the JS side decodes \uXXXX escapes back to Unicode.
    print(json.dumps(result, ensure_ascii=True))


if __name__ == "__main__":
    main()
