#!/bin/bash
set -e

BASE="https://format.obys.agency"
ASSETS_DIR="/home/ubuntu/awwwards-exploration/2026-10-20-format/assets"
KID_DIR="/home/ubuntu/awwwards-exploration/2026-10-20-format/kid"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# Asset images from /assets/
ASSETS=(
  "vertical-card-DzgfrpMV.webp"
  "horizontal-CWAIze4S.webp"
  "screens-BQ9sth5J.webp"
  "flower-CVKgWteV.webp"
  "tri-fog-BzhW1aqF.webp"
  "a-B09-tIjy.webp"
  "b-Bh_L6HFx.webp"
  "c-CgW8p4ax.webp"
  "bg7-DimjdT4q.webp"
  "d-CezkVoqu.webp"
  "e-CYwPQZib.webp"
  "f-DI0ib4TW.webp"
  "special-DCkX6FsC.webp"
  "rec-left-CR_1c09C.webp"
  "rec-right-CyoYXL7w.webp"
  "tri-bg-BUX7DWVI.webp"
  "poster-BewnwD3v.webp"
)

# Kid images from /kid/
KIDS=(
  "vertical.webp"
  "mini.webp"
  "horizontal.webp"
  "tag.webp"
  "side.webp"
  "screens.webp"
  "clock.webp"
  "deck.webp"
  "v-card.webp"
  "tile.webp"
  "bar.webp"
  "pill.webp"
  "dial.webp"
  "side-a.webp"
  "tri.webp"
  "special.webp"
  "fan.webp"
  "win.webp"
  "vee-west.webp"
  "vee-east.webp"
  "vee-tri.webp"
  "poster-shot.webp"
)

download() {
  local url=$1
  local out=$2
  for i in 1 2; do
    if curl -sL -A "$UA" --fail --max-time 30 "$url" -o "$out"; then
      echo "OK: $out"
      return 0
    fi
    echo "Retry $i for $url"
    sleep 1
  done
  echo "FAILED: $url"
  return 1
}

for asset in "${ASSETS[@]}"; do
  download "$BASE/assets/$asset" "$ASSETS_DIR/$asset"
done

for kid in "${KIDS[@]}"; do
  download "$BASE/kid/$kid" "$KID_DIR/$kid"
done

echo "All downloads attempted"
