#!/usr/bin/env bash
# One-shot script to inject BreadcrumbList JSON-LD into tool and blog pages.
# Idempotent: skips files that already contain "BreadcrumbList".
set -euo pipefail

cd "$(dirname "$0")/.."
BASE="https://online-tools.ni18.in"

# Tool slug → display name. (Spelled deliberately to match canonical title.)
declare -A TOOL_NAME=(
  ["advance-epoch-converter"]="Advanced Epoch Converter"
  ["ai-beauty-test"]="AI Beauty Test"
  ["ai-love-calculator"]="AI Love Calculator"
  ["all-in-one-text-analyzer"]="All-in-One Text Analyzer"
  ["basic-authentication-header-generator"]="Basic Auth Header Generator"
  ["free-online-image-utility-tool"]="Free Online Image Utility"
  ["grade-calculator"]="Grade Calculator"
  ["guess-the-logo"]="Guess the Logo"
  ["happy-new-year"]="Happy New Year Wish Generator"
  ["iphone-photo-fixer"]="iPhone Photo Fixer"
  ["json-comparison-tool"]="JSON Comparison Tool"
  ["json-visualizer-pro"]="JSON Visualizer Pro"
  ["markdown-to-word"]="Markdown to Word Converter"
  ["mh-meter-price-calculator"]="MH Meter Price Calculator"
  ["next-gen-gst-reforms"]="Next Gen GST Calculator"
  ["online-text-compare"]="Online Text Compare"
  ["px-to-rem-converter"]="PX to REM Converter"
  ["rem-to-px-converter"]="REM to PX Converter"
  ["screen-recorder-pro"]="Screen Recorder Pro"
  ["subtitle-resync-tool"]="Subtitle Resync Tool"
  ["vtf-converter"]="VTF Converter"
)

# Translated tool slug → display name (for /es/, /fr/ overrides)
declare -A ES_TOOL_NAME=(
  ["ai-beauty-test"]="Test de Belleza IA"
  ["px-a-rem-convertidor"]="Convertidor PX a REM"
  ["rem-to-px-converter"]="Convertidor REM a PX"
)
declare -A FR_TOOL_NAME=(
  ["ai-beauty-test"]="Test de Beauté IA"
)

# Blog post filename (without .html) → display title
declare -A BLOG_NAME=(
  ["ai-love-calculator"]="AI Love Calculator"
  ["edit-images-like-pro-free-online-tool"]="Edit Images Like a Pro"
  ["face-beauty-test"]="Face Beauty Test"
  ["iphone-photo-fixer-guide"]="HEIC to JPG Guide"
  ["json-visualizer-pro-tame-your-json-data"]="Tame Your JSON Data"
  ["markdown-to-word-guide"]="Markdown to Word Guide"
  ["px-to-rem-converter"]="PX to REM Converter Guide"
  ["vtf-converter-guide"]="VTF Converter Guide"
)
declare -A FR_BLOG_NAME=(
  ["ai-beauty-test-free-online"]="Test de Beauté IA"
  ["edit-images-like-pro-free-online-tool"]="Modifier des images comme un pro"
)

# Build a BreadcrumbList JSON-LD block.
# Args: $1=home_label $2=home_url $3=section_label $4=section_url $5=leaf_name
build_breadcrumb() {
  cat <<EOF
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "$1", "item": "$2" },
      { "@type": "ListItem", "position": 2, "name": "$3", "item": "$4" },
      { "@type": "ListItem", "position": 3, "name": "$5" }
    ]
  }
  </script>
EOF
}

inject() {
  local file="$1"; local block="$2"
  if grep -q 'BreadcrumbList' "$file"; then
    echo "SKIP (already has): $file"
    return
  fi
  awk -v b="$block" 'BEGIN{done=0} /<\/head>/ && !done {print b; done=1} {print}' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  echo "OK: $file"
}

# English tools
for slug in "${!TOOL_NAME[@]}"; do
  f="tools/$slug/index.html"
  [ -f "$f" ] || { echo "MISS: $f"; continue; }
  block=$(build_breadcrumb "Home" "$BASE/" "Tools" "$BASE/tools/" "${TOOL_NAME[$slug]}")
  inject "$f" "$block"
done

# Spanish tools
for slug in "${!ES_TOOL_NAME[@]}"; do
  f="es/tools/$slug/index.html"
  [ -f "$f" ] || { echo "MISS: $f"; continue; }
  block=$(build_breadcrumb "Inicio" "$BASE/es/" "Herramientas" "$BASE/es/tools/" "${ES_TOOL_NAME[$slug]}")
  inject "$f" "$block"
done

# French tools
for slug in "${!FR_TOOL_NAME[@]}"; do
  f="fr/tools/$slug/index.html"
  [ -f "$f" ] || { echo "MISS: $f"; continue; }
  block=$(build_breadcrumb "Accueil" "$BASE/fr/" "Outils" "$BASE/fr/tools/" "${FR_TOOL_NAME[$slug]}")
  inject "$f" "$block"
done

# English blogs
for slug in "${!BLOG_NAME[@]}"; do
  f="blogs/$slug.html"
  [ -f "$f" ] || { echo "MISS: $f"; continue; }
  block=$(build_breadcrumb "Home" "$BASE/" "Blog" "$BASE/blogs/" "${BLOG_NAME[$slug]}")
  inject "$f" "$block"
done

# French blogs
for slug in "${!FR_BLOG_NAME[@]}"; do
  f="fr/blogs/$slug.html"
  [ -f "$f" ] || { echo "MISS: $f"; continue; }
  block=$(build_breadcrumb "Accueil" "$BASE/fr/" "Blog" "$BASE/fr/blogs/" "${FR_BLOG_NAME[$slug]}")
  inject "$f" "$block"
done

echo "Done."
