# TV Splash Screen

A fullscreen splash screen for Linux Ubuntu that displays on TV at startup, allowing you to choose between Netflix and YouTube.

## Logo sources

- YouTube: https://brand.youtube/youtube-logo/ (yt_logo_fullcolor_white_digital.png)
- Netflix: https://brand.netflix.com/en/assets/logos/ (Netflix_Logo_RGB.png)

## Features

- **Split-screen layout**: Netflix on top, YouTube on bottom
- **Default selection**: Netflix is pre-selected
- **Keyboard navigation**: Arrow Up/Down, Tab, Enter
- **10-second auto-start**: Netflix launches automatically with visible countdown
- **Smooth animations**: Glow effects and transitions on selection

## Quick Start

```bash
# Test locally
./launch.sh

# Or open directly in browser
firefox index.html
```

Note: logos are not included, you must download them manually

## Enable Auto-Start on Boot

```bash
# Copy the desktop entry to autostart folder
sed -i "s/example/$(whoami)/g;" splashscreen.desktop
mkdir -p ~/.config/autostart
cp splashscreen.desktop ~/.config/autostart/
```

## Keyboard Controls

| Key | Action |
|-----|--------|
| ↑ Arrow Up | Select Netflix |
| ↓ Arrow Down | Select YouTube |
| Tab | Toggle selection |
| Enter / Space | Launch selected |
| 1 | Select Netflix |
| 2 | Select YouTube |

## Files

- `index.html` - Main HTML file
- `styles.css` - Styling and animations
- `app.js` - Keyboard navigation and countdown logic
- `launch.sh` - Browser launcher script
- `splashscreen.desktop` - Autostart configuration
- `yt_logo_fullcolor_white_digital.png` - YouTube logo
- `Netflix_Logo_RGB.png` - Netflix logo
