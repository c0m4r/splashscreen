#!/bin/bash
#
# TV Splash Screen Launcher
# Opens the splash screen in fullscreen/kiosk mode
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPLASH_FILE="file://${SCRIPT_DIR}/index.html"

# Detect available browser
if command -v brave-browser &> /dev/null; then
    BROWSER="brave-browser"
    KIOSK_FLAGS="--kiosk --start-fullscreen --disable-infobars --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-session-crashed-bubble"
elif command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
    KIOSK_FLAGS="--kiosk --start-fullscreen --disable-infobars --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-session-crashed-bubble"
elif command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
    KIOSK_FLAGS="--kiosk --start-fullscreen --disable-infobars --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-session-crashed-bubble"
elif command -v chromium &> /dev/null; then
    BROWSER="chromium"
    KIOSK_FLAGS="--kiosk --start-fullscreen --disable-infobars --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-session-crashed-bubble"
elif command -v firefox &> /dev/null; then
    BROWSER="firefox"
    KIOSK_FLAGS="--kiosk"
else
    echo "Error: No supported browser found (Brave, Chrome, Chromium, or Firefox required)"
    exit 1
fi

echo "Starting TV Splash Screen with ${BROWSER}..."
exec ${BROWSER} ${KIOSK_FLAGS} "${SPLASH_FILE}"
