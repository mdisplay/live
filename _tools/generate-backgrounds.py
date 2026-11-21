import math
import os
import random
import sys
import xml.etree.ElementTree as ET

WIDTH = 480
HEIGHT = 270
ACCENT_POOLS = [
    (160, 190, 0.30),
    (90, 150, 0.22),
    (35, 55, 0.18),
    (280, 330, 0.16),
    (210, 240, 0.14),
]

ALLOWED_TAGS = set([
    'svg',
    'defs',
    'linearGradient',
    'radialGradient',
    'stop',
    'rect',
    'ellipse',
    'circle',
    'path',
])


def clamp(value, low, high):
    return max(low, min(high, value))


def format_number(value):
    return '%.1f' % (value + 0.0)


def hsl_to_hex(h, s, l):
    h = (h % 360) / 360.0
    s = clamp(s, 0.0, 1.0)
    l = clamp(l, 0.0, 1.0)

    def hue_to_rgb(p, q, t):
        if t < 0:
            t += 1
        if t > 1:
            t -= 1
        if t < 1.0 / 6.0:
            return p + (q - p) * 6 * t
        if t < 0.5:
            return q
        if t < 2.0 / 3.0:
            return p + (q - p) * (2.0 / 3.0 - t) * 6
        return p

    if s == 0:
        r = g = b = l
    else:
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1.0 / 3.0)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1.0 / 3.0)
    return '#%02x%02x%02x' % (int(round(r * 255)), int(round(g * 255)), int(round(b * 255)))


def pick_accent_hue(rng):
    roll = rng.random()
    low = 0.0
    for start, end, weight in ACCENT_POOLS:
        if roll < low + weight:
            return rng.uniform(start, end)
        low += weight
    return rng.uniform(160, 190)


def glow_svg(rng, index):
    hue = pick_accent_hue(rng)
    cx = rng.uniform(WIDTH * -0.15, WIDTH * 1.15)
    cy = rng.uniform(HEIGHT * -0.15, HEIGHT * 1.1)
    rx = rng.uniform(130, 300)
    ry = rng.uniform(80, 210)
    peak = rng.uniform(0.45, 0.7)
    color = hsl_to_hex(hue, rng.uniform(0.8, 0.98), rng.uniform(0.55, 0.68))
    gid = 'glow%d' % index
    gradient = (
        '<radialGradient id="' + gid + '" cx="0.5" cy="0.5" r="0.5">'
        '<stop offset="0" stop-color="' + color + '" stop-opacity="' + format_number(peak) + '"/>'
        '<stop offset="0.62" stop-color="' + color + '" stop-opacity="' + format_number(peak * 0.34) + '"/>'
        '<stop offset="1" stop-color="' + color + '" stop-opacity="0"/>'
        '</radialGradient>'
    )
    shape = (
        '<ellipse cx="' + format_number(cx) + '" cy="' + format_number(cy) +
        '" rx="' + format_number(rx) + '" ry="' + format_number(ry) + '" fill="url(#' + gid + ')"/>'
    )
    return gradient, shape


def smooth_curve(points):
    parts = ['M' + format_number(points[0][0]) + ' ' + format_number(points[0][1])]
    for i in range(len(points) - 1):
        p0 = points[max(0, i - 1)]
        p1 = points[i]
        p2 = points[i + 1]
        p3 = points[min(len(points) - 1, i + 2)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        parts.append('C' + format_number(c1[0]) + ' ' + format_number(c1[1]) +
                     ' ' + format_number(c2[0]) + ' ' + format_number(c2[1]) +
                     ' ' + format_number(p2[0]) + ' ' + format_number(p2[1]))
    return ' '.join(parts)


def ribbon_svg(rng, index):
    hue = pick_accent_hue(rng)
    color = hsl_to_hex(hue, rng.uniform(0.78, 0.96), rng.uniform(0.55, 0.66))
    edge = hsl_to_hex(hue, rng.uniform(0.7, 0.9), rng.uniform(0.32, 0.42))
    y_base = rng.uniform(HEIGHT * 0.2, HEIGHT * 0.85)
    amp = rng.uniform(25, 70)
    cycles = rng.uniform(0.8, 1.8)
    phase = rng.uniform(0, 6.283)
    half = rng.uniform(18, 46)
    nodes = 13
    top = []
    bottom = []
    for i in range(nodes):
        x = WIDTH * i / (nodes - 1)
        y = y_base + amp * math.sin(phase + cycles * 2 * math.pi * i / (nodes - 1))
        top.append((x, y - half))
        bottom.append((x, y + half))
    bottom.reverse()
    d = smooth_curve(top) + ' L' + smooth_curve(bottom)[1:] + ' Z'
    gid = 'ribbon%d' % index
    gradient = (
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="' + edge + '" stop-opacity="0"/>'
        '<stop offset="0.5" stop-color="' + color + '" stop-opacity="' + format_number(rng.uniform(0.5, 0.72)) + '"/>'
        '<stop offset="1" stop-color="' + edge + '" stop-opacity="0"/>'
        '</linearGradient>'
    )
    return gradient, '<path d="' + d + '" fill="url(#' + gid + ')" opacity="' + format_number(rng.uniform(0.5, 0.75)) + '"/>'


def sheen_svg(rng, index):
    x0 = rng.uniform(WIDTH * -0.2, WIDTH * 0.7)
    w = rng.uniform(26, 70)
    dx = rng.uniform(70, 170)
    gid = 'sheen%d' % index
    peak = format_number(rng.uniform(0.06, 0.14))
    gradient = (
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="0">'
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0"/>'
        '<stop offset="0.5" stop-color="#ffffff" stop-opacity="' + peak + '"/>'
        '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>'
        '</linearGradient>'
    )
    d = ('M' + format_number(x0) + ' -20 L' + format_number(x0 + w) + ' -20 L' +
         format_number(x0 + w + dx) + ' ' + str(HEIGHT + 20) + ' L' +
         format_number(x0 + dx) + ' ' + str(HEIGHT + 20) + ' Z')
    return gradient, '<path d="' + d + '" fill="url(#' + gid + ')"/>'


def orb_svg(rng, index):
    cx = rng.uniform(WIDTH * 0.15, WIDTH * 0.85)
    cy = rng.uniform(HEIGHT * 0.15, HEIGHT * 0.7)
    r = rng.uniform(60, 130)
    peak = format_number(rng.uniform(0.08, 0.15))
    gid = 'orb%d' % index
    gradient = (
        '<radialGradient id="' + gid + '" cx="0.5" cy="0.5" r="0.5">'
        '<stop offset="0" stop-color="#ffffff" stop-opacity="' + peak + '"/>'
        '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>'
        '</radialGradient>'
    )
    return gradient, ('<ellipse cx="' + format_number(cx) + '" cy="' + format_number(cy) +
                      '" rx="' + format_number(r) + '" ry="' + format_number(r * 0.75) + '" fill="url(#' + gid + ')"/>')


def dots_svg(rng, count):
    parts = []
    for _ in range(count):
        hue = pick_accent_hue(rng)
        color = hsl_to_hex(hue, 0.85, 0.7)
        if rng.random() < 0.3:
            color = '#ffffff'
        parts.append(
            '<circle cx="' + format_number(rng.uniform(0, WIDTH)) +
            '" cy="' + format_number(rng.uniform(0, HEIGHT)) +
            '" r="' + format_number(rng.uniform(1.6, 4.5)) +
            '" fill="' + color + '" opacity="' + format_number(rng.uniform(0.08, 0.2)) + '"/>'
        )
    return ''.join(parts)


def svg_for_minute(minute):
    rng = random.Random(20261121 + minute * 7919)
    base_hue = (186 + minute * 3.7 + rng.uniform(-14, 14)) % 360
    base_top = hsl_to_hex(base_hue, rng.uniform(0.42, 0.58), rng.uniform(0.06, 0.095))
    base_mid = hsl_to_hex((base_hue + rng.uniform(-18, 18)) % 360, rng.uniform(0.5, 0.65), rng.uniform(0.035, 0.06))
    base_bottom = hsl_to_hex((base_hue + rng.uniform(-24, 24)) % 360, rng.uniform(0.48, 0.66), rng.uniform(0.015, 0.032))
    gradients = [
        '<linearGradient id="base" x1="0" y1="0" x2="0.9" y2="1">'
        '<stop offset="0" stop-color="' + base_top + '"/>'
        '<stop offset="0.55" stop-color="' + base_mid + '"/>'
        '<stop offset="1" stop-color="' + base_bottom + '"/>'
        '</linearGradient>'
    ]
    shapes = ['<rect x="0" y="0" width="' + str(WIDTH) + '" height="' + str(HEIGHT) + '" fill="url(#base)"/>']
    for index in range(rng.choice([3, 3, 4, 4, 4, 5])):
        gradient, shape = glow_svg(rng, index)
        gradients.append(gradient)
        shapes.append(shape)
    for index in range(rng.choice([1, 1, 1, 2])):
        gradient, shape = ribbon_svg(rng, 10 + index)
        gradients.append(gradient)
        shapes.append(shape)
    gradient, shape = sheen_svg(rng, 20)
    gradients.append(gradient)
    shapes.append(shape)
    if rng.random() < 0.6:
        gradient, shape = orb_svg(rng, 21)
        gradients.append(gradient)
        shapes.append(shape)
    shapes.append(dots_svg(rng, rng.choice([6, 8, 8, 10])))
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + str(WIDTH) + '" height="' + str(HEIGHT) +
        '" viewBox="0 0 ' + str(WIDTH) + ' ' + str(HEIGHT) + '" preserveAspectRatio="xMidYMid slice">'
        '<defs>' + ''.join(gradients) + '</defs>' + ''.join(shapes) + '</svg>'
    )


def validate_svg(path):
    text = open(path, 'r', encoding='utf-8').read()
    lowered = text.lower().replace('xmlns="http://www.w3.org/2000/svg"', '')
    for token in ['<filter', '<fef', '<mask', '<pattern', '<text', 'http://', 'https://', '<script', '<image']:
        if token in lowered:
            raise ValueError(path + ' contains forbidden token ' + token)
    root = ET.fromstring(text)
    for element in root.iter():
        tag = element.tag
        if '}' in tag:
            tag = tag.split('}', 1)[1]
        if tag not in ALLOWED_TAGS:
            raise ValueError(path + ' contains forbidden tag ' + tag)
    if root.attrib.get('viewBox') != '0 0 %d %d' % (WIDTH, HEIGHT):
        raise ValueError(path + ' has an unexpected viewBox')


def main(argv):
    count = 60
    if len(argv) > 1:
        count = int(argv[1])
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, 'backgrounds')
    if not os.path.isdir(out_dir):
        raise ValueError('backgrounds directory not found: ' + out_dir)
    total = 0
    for minute in range(count):
        path = os.path.join(out_dir, str(minute) + '.svg')
        with open(path, 'w', encoding='utf-8', newline='\n') as handle:
            handle.write(svg_for_minute(minute))
        validate_svg(path)
        total += os.path.getsize(path)
    print('wrote %d svg backgrounds (%d bytes total)' % (count, total))


if __name__ == '__main__':
    main(sys.argv)
