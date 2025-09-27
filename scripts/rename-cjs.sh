#!/bin/bash

# Rename .js files to .cjs
for f in dist/cjs/*.js; do
  mv "$f" "${f%.js}.cjs"
done

# Fix require paths in .cjs files
for f in dist/cjs/*.cjs; do
  sed -i 's/require("\.\([^"]*\)")/require("\.\1.cjs")/g' "$f"
done
