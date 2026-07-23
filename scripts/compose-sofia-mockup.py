#!/usr/bin/env python3
"""Gera imagens/sofia-devices-mockup.png com Sofia & Lucas nas telas do mockup.

Requer: pillow, numpy
  python3 -m venv .venv && .venv/bin/pip install pillow numpy
  .venv/bin/python scripts/compose-sofia-mockup.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
# Coloque o PNG/JPG de referência (laptop+celular) em imagens/device-mockup-ref.png
MOCKUP = ROOT / "imagens" / "device-mockup-ref.png"
DESK = ROOT / "imagens" / "sofia-desktop-screen.jpg"
MOB = ROOT / "imagens" / "sofia-mobile-screen.jpg"
OUT_PNG = ROOT / "imagens" / "sofia-devices-mockup.png"
OUT_JPG = ROOT / "imagens" / "sofia-devices-mockup.jpg"

# Quads na resolução original do mockup (TL, TR, BR, BL) — ajuste fino se trocar a arte
LAPTOP_QUAD = [(103, 56), (397.5, 89.5), (381.5, 271), (93, 234)]
PHONE_QUAD = [(365, 78), (443.5, 90.5), (428, 308), (351.5, 293.5)]
SCALE = 3


def find_coeffs(pa, pb):
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])
    a = np.asarray(matrix, dtype=float)
    b = np.array([x for p in pb for x in p], dtype=float)
    return np.linalg.lstsq(a, b, rcond=None)[0].reshape(8).tolist()


def warp_into(screen, dst_quad, canvas_size):
    w, h = screen.size
    coeffs = find_coeffs(dst_quad, [(0, 0), (w, 0), (w, h), (0, h)])
    return screen.transform(canvas_size, Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)


def poly_mask(quad, size):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon(quad, fill=255)
    return m


def expand(quad, px):
    cx = sum(p[0] for p in quad) / 4
    cy = sum(p[1] for p in quad) / 4
    out = []
    for x, y in quad:
        dx, dy = x - cx, y - cy
        n = (dx * dx + dy * dy) ** 0.5 or 1
        out.append((x + dx / n * px, y + dy / n * px))
    return out


def scaled(pts):
    return [(round(x * SCALE), round(y * SCALE)) for x, y in pts]


def main():
    if not MOCKUP.exists():
        raise SystemExit(f"Falta a referência: {MOCKUP}")
    base = Image.open(MOCKUP).convert("RGBA")
    base = base.resize((base.width * SCALE, base.height * SCALE), Image.Resampling.LANCZOS)
    w, h = base.size
    laptop = scaled(LAPTOP_QUAD)
    phone = scaled(PHONE_QUAD)

    desk_w = warp_into(Image.open(DESK).convert("RGBA"), laptop, (w, h))
    mob_w = warp_into(Image.open(MOB).convert("RGBA"), phone, (w, h))

    chrome = base.copy()
    carr = np.array(chrome)
    hole = Image.new("L", (w, h), 0)
    dr = ImageDraw.Draw(hole)
    dr.polygon(expand(laptop, 3 * SCALE), fill=255)
    dr.polygon(expand(phone, 3 * SCALE), fill=255)
    hole_a = np.array(hole)
    carr[:, :, 3] = np.where(hole_a > 128, 0, carr[:, :, 3])
    chrome = Image.fromarray(carr)

    carr = np.array(chrome)
    r, g, b, a = (carr[:, :, i].astype(int) for i in range(4))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    bright = (r + g + b) // 3
    yy, xx = np.mgrid[0:h, 0:w]
    chk = (xx > w * 0.55) & (yy > h * 0.55) & (sat < 12) & (bright > 165) & (bright < 235)
    white = (r > 250) & (g > 250) & (b > 250)
    carr[:, :, 3] = np.where(chk | white, 0, carr[:, :, 3]).astype(np.uint8)
    chrome = Image.fromarray(carr)

    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.paste(desk_w, (0, 0), poly_mask(laptop, (w, h)))
    canvas.paste(mob_w, (0, 0), poly_mask(phone, (w, h)))
    canvas = Image.alpha_composite(canvas, chrome)

    bbox = canvas.getbbox()
    pad = 8 * SCALE
    l, t, r, b = bbox
    canvas = canvas.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))
    web = canvas.resize((1200, int(1200 * canvas.height / canvas.width)), Image.Resampling.LANCZOS)
    web.save(OUT_PNG, optimize=True)
    bg = Image.new("RGB", web.size, (28, 28, 30))
    bg.paste(web, mask=web.split()[-1])
    bg.save(OUT_JPG, quality=92, optimize=True)
    print("OK →", OUT_PNG)


if __name__ == "__main__":
    main()
