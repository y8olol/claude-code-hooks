#!/usr/bin/env node
// Auto-continue hook — Stop event (exit code 2 forces Claude to keep going)
// Fires when Claude stops mid-response due to timeout or error.
// Exits with code 2 to force continuation. Checks stop_hook_active
// to prevent infinite loops.

let input = "";
const stdinTimeout = setTimeout(() => process.exit(0), 5000);
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input || "{}");

    // Prevent infinite loop — if we already triggered a continuation, stop
    if (data.stop_hook_active === true) {
      process.exit(0);
    }

    // Exit code 2 forces Claude to continue generating
    process.stderr.write("Auto-continuing...\n");
    process.exit(2);
  } catch {
    process.exit(0);
  }
});
