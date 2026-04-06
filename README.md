# claude-code-hooks

Quality-of-life hooks for [Claude Code](https://claude.ai/code) — automatic response continuation on timeout and sound notifications when Claude finishes.

## Hooks

### Auto-continue on timeout (`StopFailure`)
When a response times out or fails mid-generation, automatically injects `continue` so Claude picks up where it left off. No more manually typing "continue" after a `Request timed out` error.

### Sound notification on completion (`Stop`)
Plays a system sound when Claude finishes responding so you know it's done without watching the screen. Uses `afplay` on macOS and `paplay`/`aplay` on Linux.

## Install

```bash
git clone https://github.com/YOUR_USERNAME/claude-code-hooks
cd claude-code-hooks
chmod +x install.sh
./install.sh
```

Then open `/hooks` inside Claude Code to reload config.

## Manual install

1. Copy `hooks/auto-continue.js` and `hooks/notify-done.sh` to `~/.claude/hooks/`
2. `chmod +x ~/.claude/hooks/auto-continue.js ~/.claude/hooks/notify-done.sh`
3. Merge the contents of `settings-snippet.json` into `~/.claude/settings.json`

## Customize the sound (macOS)

Edit `~/.claude/hooks/notify-done.sh` and swap `Glass.aiff` for any file in `/System/Library/Sounds/`:

```
Basso   Blow    Bottle  Frog    Funk
Glass   Hero    Morse   Ping    Pop
Purr    Sosumi  Submarine  Tink
```

## Requirements

- [Claude Code](https://claude.ai/code)
- Node.js (for `auto-continue.js`)
- macOS or Linux
