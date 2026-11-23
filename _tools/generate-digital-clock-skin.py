import os
import sys

SKIN = 'modern'
WIDTH = 120
HEIGHT = 200
THICKNESS = 18
RADIUS = 9
SEGMENTS = {
    'a': (22, 12, 76, THICKNESS),
    'b': (90, 24, THICKNESS, 64),
    'c': (90, 112, THICKNESS, 64),
    'd': (22, 170, 76, THICKNESS),
    'e': (12, 112, THICKNESS, 64),
    'f': (12, 24, THICKNESS, 64),
    'g': (22, 91, 76, THICKNESS),
}
DIGITS = {
    '0': ('a', 'b', 'c', 'd', 'e', 'f'),
    '1': ('b', 'c'),
    '2': ('a', 'b', 'g', 'e', 'd'),
    '3': ('a', 'b', 'c', 'd', 'g'),
    '4': ('f', 'b', 'g', 'c'),
    '5': ('a', 'f', 'g', 'c', 'd'),
    '6': ('a', 'f', 'e', 'd', 'c', 'g'),
    '7': ('a', 'b', 'c'),
    '8': ('a', 'b', 'c', 'd', 'e', 'f', 'g'),
    '9': ('a', 'b', 'c', 'd', 'f', 'g'),
}


def svg_open(title, width, height):
    return [
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid meet">' % (width, height, width, height),
        '<title>' + title + '</title>',
        '<defs>',
        '<linearGradient id="modern-digit" x1="0" y1="0" x2="0" y2="1">',
        '<stop offset="0" stop-color="#ffffff"/>',
        '<stop offset="0.2" stop-color="#ffffff"/>',
        '<stop offset="0.46" stop-color="#bee5ff"/>',
        '<stop offset="0.66" stop-color="#5cbcff"/>',
        '<stop offset="1" stop-color="#0097ff"/>',
        '</linearGradient>',
        '</defs>',
    ]


def rect_shape(name):
    x, y, width, height = SEGMENTS[name]
    return '<rect x="%d" y="%d" width="%d" height="%d" rx="%d" fill="url(#modern-digit)"/>' % (x, y, width, height, RADIUS)


def digit_svg(digit):
    lines = svg_open('Modern digit ' + digit, WIDTH, HEIGHT)
    for segment in DIGITS[digit]:
        lines.append(rect_shape(segment))
    lines.append('</svg>')
    return '\n'.join(lines) + '\n'


def colon_svg():
    lines = svg_open('Modern colon', 60, HEIGHT)
    lines.append('<circle cx="30" cy="70" r="16" fill="url(#modern-digit)"/>')
    lines.append('<circle cx="30" cy="130" r="16" fill="url(#modern-digit)"/>')
    lines.append('</svg>')
    return '\n'.join(lines) + '\n'


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'assets', 'digital-clock', 'skins', SKIN)
    if not os.path.isdir(root):
        os.makedirs(root)
    for digit in sorted(DIGITS.keys()):
        with open(os.path.join(root, digit + '.svg'), 'w') as handle:
            handle.write(digit_svg(digit))
    with open(os.path.join(root, 'colon.svg'), 'w') as handle:
        handle.write(colon_svg())


if __name__ == '__main__':
    main()
