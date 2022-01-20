#!/bin/bash

###########################################################################################
# This scripts extracts the Gutenberg package versions from a Gutenberg release directory #
###########################################################################################

GUTENBERG_DIR=$1
PACKAGES_DIR="$GUTENBERG_DIR/packages"
PACKAGES=(
  "api-fetch"
  "base-styles"
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

if [[ ! -d $PACKAGES_DIR ]]; then
    echo 'Directory does not exist';
    exit 1
fi

cd $PACKAGES_DIR

MISSING_PACKAGES=()
for PACKAGE in ${PACKAGES[@]}; do
    FILE="$PACKAGE/package.json"
    if [[ -f $FILE ]]; then
        VERSION=$(cat $FILE | egrep -o '"version": (".*")' | egrep -o '\d+\.\d+\.\d+')
        PACKAGE_VERSION="\"@wordpress/$PACKAGE\": \"~$VERSION\","
        echo $PACKAGE_VERSION
    else
        MISSING_PACKAGES+=($PACKAGE)
    fi
done

for PACKAGE in ${MISSING_PACKAGES[@]}; do
    echo "Package '$PACKAGE' was not found."
done

exit 0
