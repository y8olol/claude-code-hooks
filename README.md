# claude-code-hooks

Quality-of-life hooks for [Claude Code](https://claude.ai/code) — automatic response continuation on timeout and sound notifications when Claude finishes.

## Hooks

### Auto-format with Prettier (`PostToolUse`)

Automatically runs Prettier on any file Claude edits or writes. Uses `--ignore-unknown` so unsupported file types are silently skipped. Requires Prettier (`npm i -g prettier` or available via `npx`).

### Auto-continue on failure (`Stop`)

When Claude stops mid-response due to a timeout, content block, or any error, automatically forces continuation via exit code 2 on the `Stop` hook. Checks `stop_hook_active` to prevent infinite loops.

### Auto-approve permission requests (`permissions.defaultMode`)

Skips all "Do you want to proceed?" dialogs by setting `defaultMode: dontAsk` in permissions. Covers both file edits and bash commands. More reliable than a hook since it operates at the settings level.

> **Note:** This approves all permission requests. Remove or change `defaultMode` in `settings.json` if you want selective approval.

### Sound notification on completion (`Stop`)

Plays a system sound when Claude finishes responding so you know it's done without watching the screen. Uses `afplay` on macOS and `paplay`/`aplay` on Linux.

## Install

```bash
git clone https://github.com/y8olol/claude-code-hooks
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
