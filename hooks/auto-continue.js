#!/usr/bin/env node
// Auto-continue hook — Stop event (exit code 2 forces Claude to keep going)
// Only fires when Claude stopped due to an actual error/failure.
// Checks stop_hook_active to prevent infinite loops.

let input = "";
const stdinTimeout = setTimeout(() => process.exit(0), 5000);
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input || "{}");

    // Prevent infinite loop
    if (data.stop_hook_active === true) {
      process.exit(0);
    }

    // Only continue on actual errors, not normal stops
    const reason = data.stop_reason || data.reason || "";
    const isError =
      /error|timeout|timed?\s*out|failed|blocked|451|rate.?limit/i.test(reason);

    if (!isError) {
      process.exit(0);
    }

    process.stderr.write("Auto-continuing...\n");
    process.exit(2);
  } catch {
    process.exit(0);
  }
});
