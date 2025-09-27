#!/bin/bash

# Rename .js files to .cjs if they exist
shopt -s nullglob  # This makes the glob return empty array if no matches
for f in dist/cjs/*.js; do
  mv "$f" "${f%.js}.cjs"
done

# Fix require paths in .cjs files
for f in dist/cjs/*.cjs; do
  # Add .cjs extension to local requires only
  sed -i 's/require("\.\/\([^"]*\)")/require(".\/\1.cjs")/g' "$f"
done