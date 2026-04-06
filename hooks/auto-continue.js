#!/usr/bin/env node
// Auto-continue hook — Stop event (exit code 2 forces Claude to keep going)
// Detects errors by checking last_assistant_message for specific error formats.
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

    // Match specific error formats Claude Code actually outputs — not generic words
    const lastMsg = data.last_assistant_message || "";
    const isError =
      /request timed out\.\s*\(request_id=/i.test(lastMsg) || // timeout with request_id
      /error code:\s*\d+/i.test(lastMsg) || // "Error code: 451"
      /censorship_blocked/i.test(lastMsg) || // content block
      /\(request_id=req_[a-z0-9]+\)\s*$/i.test(lastMsg); // ends with request_id

    if (!isError) {
      process.exit(0);
    }

    process.stderr.write("Auto-continuing...\n");
    process.exit(2);
  } catch {
    process.exit(0);
  }
});
