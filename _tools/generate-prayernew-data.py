#!/usr/bin/env python3
"""Generate prayernew-data.js (window.PRAYER_DATA.ZONE1..ZONE13) from ACJU PDFs.

Source PDFs are monthly prayer-time tables downloaded from
https://www.acju.lk/prayer-times/ into resources/.
File name convention:
    01.-Colombo-1.pdf                              -> zone 01, month 1
    09.-Trincomalee-...-Hanafi__06_006.pdf         -> zone 09, month 6
Each PDF row contains 7 times:
    Subah, Sunrise, Luhar, Asr-Shafie, Asr-Hanafi, Magrib, Isha

Output format matches the existing prayernew-data.js style:
    window.PRAYER_DATA.ZONE1 = {
      January: [
        { range: [1, 2], times: ['05:00', '06:22', '12:15', '15:37', '16:29', '18:07', '19:21'] },
        ...
      ],
      ...
    };
Consecutive days with identical times are merged into one range entry.

Usage (from the repository root):
    python3 _tools/generate-prayernew-data.py            # write prayernew-data.js
    python3 _tools/generate-prayernew-data.py --check    # verify current file, no write
"""

import argparse
import glob
import os
import re
import sys
import zlib

MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]
MONTH_ALT = '|'.join(MONTHS + [m[:3] for m in MONTHS])
MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESOURCES_DIR = os.path.join(ROOT, 'resources')
OUTPUT_FILE = os.path.join(ROOT, 'prayernew-data.js')


def extract_text(path):
    data = open(path, 'rb').read()
    parts = []
    for match in re.finditer(rb'stream\r?\n', data):
        start = match.end()
        end = data.find(b'endstream', start)
        if end == -1:
            continue
        raw = data[start:end]
        try:
            stream = zlib.decompress(raw)
        except Exception:
            continue
        if b'TJ' in stream or b'Tj' in stream:
            parts.append(stream)
    blob = b''.join(parts)
    chunks = []
    for tm in re.finditer(rb'\[((?:[^\[\]\\]|\\.)*)\]\s*TJ|\(((?:[^()\\]|\\.)*)\)\s*Tj', blob):
        if tm.group(1) is not None:
            chunks.append(b''.join(re.findall(rb'\(((?:[^()\\]|\\.)*)\)', tm.group(1))))
        else:
            chunks.append(tm.group(2))
    text = b''.join(chunks).decode('latin-1')
    return re.sub(r'\\([()\\])', r'\1', text)


def parse_pdf(path):
    text = extract_text(path)
    times = [
        (m.start(), m.end(), int(m.group(1)), int(m.group(2)), m.group(3))
        for m in re.finditer(r'(1[0-2]|[1-9])\s?:\s?(\d{2})\s?([AP])M', text)
    ]
    rows = []
    for i in range(0, len(times), 7):
        chunk = times[i:i + 7]
        if len(chunk) < 7:
            break
        segment = text[times[i - 1][1] if i else 0:chunk[0][0]]
        date_match = None
        for dm in re.finditer(
            r'(\d{1,2})\s?-\s?(' + MONTH_ALT + r')|(' + MONTH_ALT + r')\w*\s?-\s?(\d{1,2})(?![\d:])',
            segment,
        ):
            date_match = dm
        if date_match is None:
            raise ValueError('no date found for row in %s' % os.path.basename(path))
        if date_match.group(1):
            day, month = int(date_match.group(1)), date_match.group(2)[:3]
        else:
            month, day = date_match.group(3)[:3], int(date_match.group(4))
        rows.append((day, month, chunk))
    return rows


def to24(time):
    hour, minute, meridiem = time[2], time[3], time[4]
    if meridiem == 'P' and hour != 12:
        hour += 12
    if meridiem == 'A' and hour == 12:
        hour = 0
    return '%02d:%02d' % (hour, minute)


def zone_and_month(filename):
    base = os.path.basename(filename)
    zone = int(re.match(r'(\d{2})\.-', base).group(1))
    month_match = re.search(r'-(1[0-2]|[1-9])\.pdf$', base) or re.search(r'__(\d{2})_\d{3}\.pdf$', base)
    return zone, int(month_match.group(1))


def collect_prayer_data():
    parsed = {}
    for path in sorted(glob.glob(os.path.join(RESOURCES_DIR, '*.pdf'))):
        zone, month_number = zone_and_month(path)
        month = MONTHS[month_number - 1]
        if month in parsed.get(zone, {}):
            raise ValueError('duplicate file for zone %d %s' % (zone, month))
        data = {}
        for day, embedded_month, chunk in parse_pdf(path):
            if embedded_month != month[:3]:
                raise ValueError('%s: row month %s does not match file month %s' % (
                    os.path.basename(path), embedded_month, month))
            if day in data:
                raise ValueError('%s: duplicate day %d' % (os.path.basename(path), day))
            data[day] = [to24(t) for t in chunk]
        expected_days = MONTH_DAYS[month_number - 1]
        if sorted(data) != list(range(1, expected_days + 1)):
            raise ValueError('%s: expected days 1..%d, got %d rows' % (
                os.path.basename(path), expected_days, len(data)))
        parsed.setdefault(zone, {})[month] = data

    missing = [
        (zone, month) for zone in range(1, 14) for month in MONTHS
        if month not in parsed.get(zone, {})
    ]
    if missing:
        raise ValueError('missing zone/month data: %s' % missing)
    return parsed


def zone_comments():
    comments = {}
    if os.path.exists(OUTPUT_FILE):
        text = open(OUTPUT_FILE).read()
        comments = {int(z): c for z, c in re.findall(r'// Zone (\d+): ([^\n]*)', text)}
    return comments


def render(parsed):
    comments = zone_comments()
    lines = []
    lines.append('if(!window.PRAYER_DATA) {')
    lines.append('  window.PRAYER_DATA = {};')
    lines.append('}')
    lines.append('')
    for zone in range(1, 14):
        lines.append('// Zone %d: %s' % (zone, comments.get(zone, '')))
        lines.append('window.PRAYER_DATA.ZONE%d = {' % zone)
        for month in MONTHS:
            lines.append('  %s: [' % month)
            data = parsed[zone][month]
            rows = []
            for day in sorted(data):
                times = data[day]
                if rows and rows[-1][2] == times and rows[-1][1] == day - 1:
                    rows[-1] = (rows[-1][0], day, times)
                else:
                    rows.append((day, day, times))
            for start, end, times in rows:
                lines.append("    { range: [%d, %d], times: ['%s'] }," % (
                    start, end, "', '".join(times)))
            lines.append('  ],')
        lines.append('};')
        if zone < 13:
            lines.append('')
    lines.append('')
    lines.append('')
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true',
                        help='verify that prayernew-data.js matches resources/ without writing')
    args = parser.parse_args()

    parsed = collect_prayer_data()
    content = render(parsed)
    total_days = sum(len(days) for months in parsed.values() for days in months.values())

    if args.check:
        current = open(OUTPUT_FILE).read() if os.path.exists(OUTPUT_FILE) else ''
        if current == content:
            print('OK: %s matches resources/ (%d zone-days)' % (
                os.path.basename(OUTPUT_FILE), total_days))
            return 0
        print('MISMATCH: %s differs from resources/ (%d zone-days)' % (
            os.path.basename(OUTPUT_FILE), total_days))
        return 1

    open(OUTPUT_FILE, 'w').write(content)
    print('Wrote %s (%d zone-days, %d zones x %d months)' % (
        os.path.basename(OUTPUT_FILE), total_days, len(parsed), len(MONTHS)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
