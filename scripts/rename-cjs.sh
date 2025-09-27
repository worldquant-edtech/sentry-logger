#!/bin/bash

# Rename .js files to .cjs
for f in dist/cjs/*.js; do
  mv "$f" "${f%.js}.cjs"
done

# Fix require paths in .cjs files
for f in dist/cjs/*.cjs; do
  # First, handle any existing .js extensions
  sed -i 's/require("\.\([^"]*\)\.js")/require("\.\1.cjs")/g' "$f"
  
  # Then handle paths without extensions, but don't touch paths that already end in .cjs
  sed -i 's/require("\.\([^"]*[^."]\)")/require("\.\1.cjs")/g' "$f"
done