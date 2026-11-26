#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render one page of a PDF to a PNG file (for scanned/image-only books).

Usage:
    python render_page.py <path-to-pdf> <zero-based-page> <output-png> [zoom]

Prints the output path to stdout on success. All diagnostics go to stderr.
Requires PyMuPDF (pymupdf), installed alongside the other book extractors.
"""

import os
import sys


def main():
    if len(sys.argv) < 4:
        print("Usage: render_page.py <pdf> <page> <out.png> [zoom]", file=sys.stderr)
        sys.exit(2)

    path = sys.argv[1]
    try:
        page_no = int(sys.argv[2])
    except ValueError:
        print("page must be an integer", file=sys.stderr)
        sys.exit(2)
    out = sys.argv[3]
    try:
        zoom = float(sys.argv[4]) if len(sys.argv) > 4 else 1.4
    except ValueError:
        zoom = 1.4
    if zoom < 0.4:
        zoom = 0.4
    if zoom > 4.0:
        zoom = 4.0

    import pymupdf

    doc = pymupdf.open(path)
    try:
        if page_no < 0 or page_no >= len(doc):
            print("page out of range: %d (doc has %d pages)" % (page_no, len(doc)), file=sys.stderr)
            sys.exit(3)
        page = doc[page_no]
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        parent = os.path.dirname(out)
        if parent:
            os.makedirs(parent, exist_ok=True)
        pix.save(out)
    finally:
        doc.close()

    print(out)


if __name__ == "__main__":
    main()
