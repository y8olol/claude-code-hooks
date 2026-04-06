#!/usr/bin/env bash
set -e

HOOKS_DIR="$HOME/.claude/hooks"
SETTINGS="$HOME/.claude/settings.json"

echo "Installing claude-code-hooks..."

# Create hooks directory
mkdir -p "$HOOKS_DIR"

# Copy hook files
cp hooks/auto-continue.js "$HOOKS_DIR/auto-continue.js"
cp hooks/notify-done.sh "$HOOKS_DIR/notify-done.sh"
chmod +x "$HOOKS_DIR/auto-continue.js"
chmod +x "$HOOKS_DIR/notify-done.sh"

echo "Hook files installed to $HOOKS_DIR"

# Merge into settings.json using Node.js (avoids jq dependency)
node - "$SETTINGS" <<'EOF'
const fs = require('fs');
const path = require('path');

const settingsPath = process.argv[2];
let settings = {};

if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch {
    console.error('Warning: existing settings.json is malformed — creating fresh');
  }
}

settings.hooks = settings.hooks || {};

// StopFailure: auto-continue
settings.hooks.StopFailure = settings.hooks.StopFailure || [];
const alreadyHasAutoContinue = settings.hooks.StopFailure.some(entry =>
  entry.hooks?.some(h => h.command?.includes('auto-continue'))
);
if (!alreadyHasAutoContinue) {
  settings.hooks.StopFailure.push({
    hooks: [{
      type: 'command',
      command: `node "${process.env.HOME}/.claude/hooks/auto-continue.js"`
    }]
  });
}

// Stop: sound notification
settings.hooks.Stop = settings.hooks.Stop || [];
const alreadyHasNotify = settings.hooks.Stop.some(entry =>
  entry.hooks?.some(h => h.command?.includes('notify-done'))
);
if (!alreadyHasNotify) {
  settings.hooks.Stop.push({
    hooks: [{
      type: 'command',
      command: `"${process.env.HOME}/.claude/hooks/notify-done.sh"`,
      async: true
    }]
  });
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log('settings.json updated successfully');
EOF

echo ""
echo "Done! Open /hooks in Claude Code to reload config."
