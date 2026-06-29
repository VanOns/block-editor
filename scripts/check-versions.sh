#!/bin/bash

###########################################################################################
# Check @wordpress/* package version drift against latest available on npm               #
###########################################################################################

PACKAGES=(
  "api-fetch"
  "block-editor"
  "block-library"
  "blocks"
  "components"
  "data"
  "element"
  "format-library"
  "hooks"
  "keyboard-shortcuts"
  "server-side-render"
)

echo "Checking @wordpress/* package versions..."
echo ""
printf "%-30s %-12s %-12s %-8s\n" "Package" "Installed" "Latest" "Status"
printf "%-30s %-12s %-12s %-8s\n" "-------" "---------" "------" "------"

HAS_DRIFT=0
for PACKAGE in "${PACKAGES[@]}"; do
    PKG_JSON="node_modules/@wordpress/$PACKAGE/package.json"
    if [[ -f "$PKG_JSON" ]]; then
        INSTALLED=$(grep -o '"version": "[^"]*"' "$PKG_JSON" | head -1 | grep -o '[0-9][0-9.]*')
    else
        INSTALLED="not installed"
    fi
    LATEST=$(npm view "@wordpress/$PACKAGE" version 2>/dev/null)

    if [[ "$INSTALLED" == "$LATEST" ]]; then
        STATUS="✓"
    else
        STATUS="⚠ DRIFT"
        HAS_DRIFT=1
    fi

    printf "%-30s %-12s %-12s %-8s\n" "@wordpress/$PACKAGE" "$INSTALLED" "$LATEST" "$STATUS"
done

echo ""
if [[ $HAS_DRIFT -eq 1 ]]; then
    echo "⚠  Version drift detected. Run 'bun update' for semver-compatible updates."
    echo "   For major version bumps, update package.json ranges manually."
    exit 1
else
    echo "✓  All packages at latest versions."
    exit 0
fi
