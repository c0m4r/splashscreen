#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPLASH_FILE="file://${SCRIPT_DIR}/index.html"

cd $SCRIPT_DIR
firefox $SPLASH_FILE
