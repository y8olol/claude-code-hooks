#!/usr/bin/env bash
# notify-done.sh — Stop event hook
# Plays a sound when Claude finishes responding so you know it's done
# without watching the screen.
#
# macOS: uses afplay with a built-in system sound
# Linux: uses paplay (PulseAudio) or aplay as fallback

if [[ "$OSTYPE" == "darwin"* ]]; then
  afplay /System/Library/Sounds/Glass.aiff 2>/dev/null
elif command -v paplay &>/dev/null; then
  paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null
elif command -v aplay &>/dev/null; then
  aplay /usr/share/sounds/alsa/Front_Center.wav 2>/dev/null
fi
