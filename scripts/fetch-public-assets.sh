#!/usr/bin/env bash

set -euo pipefail

source_site="${SOURCE_SITE_URL:-https://color-and-rest-magazine.managerbp9.chatgpt.site}"
mirror_dir=".site-mirror"

rm -rf "$mirror_dir" public
mkdir -p "$mirror_dir" public

wget \
  --recursive \
  --level=inf \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --no-parent \
  --no-host-directories \
  --domains="$(printf '%s' "$source_site" | sed -E 's#^https?://([^/]+).*$#\1#')" \
  --directory-prefix="$mirror_dir" \
  --execute robots=off \
  --user-agent="Mozilla/5.0 (compatible; ColorAndRestPages/1.0)" \
  --quiet \
  "$source_site/"

for asset_dir in images fonts downloads; do
  if [[ -d "$mirror_dir/$asset_dir" ]]; then
    cp -R "$mirror_dir/$asset_dir" "public/$asset_dir"
  fi
done

if [[ -f "$mirror_dir/favicon.svg" ]]; then
  cp "$mirror_dir/favicon.svg" public/favicon.svg
fi

missing=0
while IFS= read -r asset; do
  if [[ ! -f "public$asset" ]]; then
    printf 'Missing public asset: %s\n' "$asset" >&2
    missing=1
  fi
done < <(grep -RhoE '"/(images|fonts|downloads)/[^" )]+' app | tr -d '"' | sort -u)

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

test -f public/favicon.svg
touch public/.nojekyll
