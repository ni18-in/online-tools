#!/usr/bin/env bash
# Adds loading="lazy" decoding="async" + explicit width/height to <img> tags
# whose src is a placehold.co URL (which encodes dimensions as /WxH/...).
# Idempotent: only modifies <img> tags that don't already have a loading= attr.
set -euo pipefail
cd "$(dirname "$0")/.."

# Build the list of files containing placehold.co <img> tags
files=$(grep -rlE '<img\b[^>]*src="https://placehold\.co/' --include="*.html" . 2>/dev/null || true)
[ -z "$files" ] && { echo "No matching <img> tags found."; exit 0; }

total=0
for f in $files; do
  before=$(grep -cE '<img\b[^>]*src="https://placehold\.co/' "$f" || true)
  # -0777 slurps the file so the regex can match attributes split over multiple lines.
  perl -i -0777 -pe '
    s{
      (<img\b)                              # 1: opening tag
      (                                      # 2: attribute soup before src
        (?:(?!loading=)[^>])*?
      )
      (src="https://placehold\.co/(\d+)x(\d+)[^"]*") # 3: src attr; 4,5: W,H
      (                                      # 6: rest of tag
        (?:(?!loading=)[^>])*
      )
      (>)                                    # 7: close
    }{$1$2$3 loading="lazy" decoding="async" width="$4" height="$5"$6$7}gxs
  ' "$f"
  after=$(grep -cE '<img\b[^>]*loading="lazy"[^>]*src="https://placehold\.co/' "$f" || true)
  if [ "$after" -gt 0 ]; then
    total=$((total+after))
    echo "OK: $f ($before tags, $after now lazy)"
  fi
done

echo ""
echo "Total <img> tags optimized: $total"
