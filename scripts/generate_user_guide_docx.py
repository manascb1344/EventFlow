"""Build DOCS/EventFlow_User_Guide.docx from DOCS/user-guide.md.

The Markdown guide is the single source. This script converts its headings,
paragraphs, bullet lists, tables, code blocks and screenshots into a Word file.

    pip install python-docx
    python scripts/generate_user_guide_docx.py [output.docx]
"""

import re
import sys
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
GUIDE = ROOT / "DOCS" / "user-guide.md"
DEFAULT_OUT = ROOT / "DOCS" / "EventFlow_User_Guide.docx"
ACCENT = RGBColor(0x0B, 0x7A, 0x8C)
IMAGE_WIDTH = Inches(6.3)
MAX_IMAGE_HEIGHT = Inches(8.2)

INLINE = re.compile(r"(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))")
IMAGE = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)$")


def add_inline(paragraph, text):
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            paragraph.add_run(part[2:-2]).bold = True
        elif part.startswith("`") and part.endswith("`"):
            run = paragraph.add_run(part[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(9.5)
        elif part.startswith("["):
            label, target = re.match(r"\[([^\]]+)\]\(([^)]+)\)", part).groups()
            run = paragraph.add_run(label)
            run.font.color.rgb = ACCENT
            if target.startswith("http"):
                paragraph.add_run(f" ({target})")
        else:
            paragraph.add_run(part)


def add_image(doc, alt, rel_path):
    path = (GUIDE.parent / rel_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"Screenshot missing: {path}")
    from PIL import Image

    with Image.open(path) as img:
        w, h = img.size
    width = IMAGE_WIDTH
    if width * h / w > MAX_IMAGE_HEIGHT:
        width = int(MAX_IMAGE_HEIGHT * w / h)
    doc.add_picture(str(path), width=width)
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption = doc.add_paragraph(alt)
    caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption.runs[0].italic = True
    caption.runs[0].font.size = Pt(9)


def add_table(doc, rows):
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    header, body = cells[0], [r for r in cells[2:]]
    table = doc.add_table(rows=1, cols=len(header))
    table.style = "Light Grid Accent 1"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, text in enumerate(header):
        p = table.rows[0].cells[i].paragraphs[0]
        p.add_run(text).bold = True
    for row in body:
        out = table.add_row().cells
        for i, text in enumerate(row[: len(header)]):
            add_inline(out[i].paragraphs[0], text)
    doc.add_paragraph()


def add_title_page(doc):
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("EventFlow")
    run.bold = True
    run.font.size = Pt(36)
    run.font.color.rgb = ACCENT
    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.add_run("End-to-end user guide").font.size = Pt(18)
    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    meta.add_run(
        "Organizer and attendee flows on https://eventflow.zephop.com\n"
        f"Generated {date.today():%d %B %Y} from DOCS/user-guide.md"
    ).font.size = Pt(11)
    doc.add_page_break()


def build(out_path):
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)
    for section in doc.sections:
        section.left_margin = section.right_margin = Inches(0.9)
    add_title_page(doc)

    lines = GUIDE.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            i += 1
            continue
        if line.startswith("```"):
            block = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i])
                i += 1
            p = doc.add_paragraph()
            run = p.add_run("\n".join(block))
            run.font.name = "Consolas"
            run.font.size = Pt(9.5)
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i])
                i += 1
            add_table(doc, rows)
            continue
        heading = re.match(r"^(#{1,4})\s+(.*)", line)
        if heading:
            level = len(heading.group(1))
            if level == 1:
                i += 1
                continue
            if level == 2 and doc.paragraphs and doc.paragraphs[-1].text:
                doc.add_page_break()
            h = doc.add_heading(heading.group(2), level=level - 1)
            for run in h.runs:
                run.font.color.rgb = ACCENT
            i += 1
            continue
        image = IMAGE.match(line)
        if image:
            add_image(doc, *image.groups())
            i += 1
            continue
        if line.startswith("- "):
            add_inline(doc.add_paragraph(style="List Bullet"), line[2:])
            i += 1
            continue
        add_inline(doc.add_paragraph(), line)
        i += 1

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out_path)
    return out_path


if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT
    print(f"Wrote {build(target)}")
