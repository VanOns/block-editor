#!/bin/bash

###########################################################################################
# Validate that all @wordpress SCSS source imports still resolve                         #
###########################################################################################

SCSS_DIR="src/styles/dependencies"
ERRORS=0
TOTAL=0

if [[ ! -d "$SCSS_DIR" ]]; then
    echo "Directory $SCSS_DIR does not exist"
    exit 1
fi

for FILE in "$SCSS_DIR"/*.scss; do
    [[ -f "$FILE" ]] || continue

    while IFS= read -r line; do
        # Extract path from @use "path";
        PATH_REF=$(echo "$line" | sed -n 's/.*@use "\([^"]*\)".*/\1/p')
        if [[ -z "$PATH_REF" ]]; then continue; fi
        if [[ "$PATH_REF" != *"node_modules"* ]]; then continue; fi

        ((TOTAL++))

        # Resolve relative path from the file's directory
        RESOLVED="$(cd "$(dirname "$FILE")" && cd "$(dirname "$PATH_REF")" 2>/dev/null && pwd)/$(basename "$PATH_REF")"
        if [[ ! -f "$RESOLVED" ]]; then
            echo "BROKEN: $FILE → $PATH_REF"
            ((ERRORS++))
        fi
    done < "$FILE"
done

echo ""
if [[ $ERRORS -gt 0 ]]; then
    echo "⚠  $ERRORS broken SCSS import path(s) out of $TOTAL total."
    echo "   WordPress packages may have restructured their src/ directories."
    exit 1
else
    echo "✓  All $TOTAL SCSS import paths resolve correctly."
    exit 0
fi
