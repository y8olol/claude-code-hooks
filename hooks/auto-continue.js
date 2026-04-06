#!/usr/bin/env node
// Auto-continue hook — StopFailure event
// When a response times out or fails mid-generation, injects "continue"
// as additionalContext so Claude picks up where it left off.

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 5000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input || '{}');
    const reason = data.stop_reason || data.reason || '';

    // Only inject "continue" on timeout/request errors, not intentional stops
    const isTimeout = /timed?\s*out|timeout|request.*failed|network/i.test(reason);

    // If no reason provided (unknown failure), still try to continue
    if (reason && !isTimeout) {
      process.exit(0);
    }

    const output = {
      hookSpecificOutput: {
        hookEventName: 'StopFailure',
        additionalContext: 'continue'
      }
    };

    process.stdout.write(JSON.stringify(output));
  } catch {
    process.exit(0);
  }
});
