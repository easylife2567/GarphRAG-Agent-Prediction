import { d as defineEventHandler, c as getQuery } from '../../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const mockConsoleLogs = [
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level: "INFO",
    message: "[System] Loading simulation data for report..."
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level: "INFO",
    message: "[System] Found 100 posts and 20 agent profiles."
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level: "INFO",
    message: "[System] Generating section summaries..."
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level: "INFO",
    message: "[System] Report rendering completed."
  }
];
const consoleLog_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fromLine = Number(query.from_line) || 0;
  const limit = 2;
  const logs = mockConsoleLogs.slice(fromLine, fromLine + limit);
  return {
    success: true,
    data: {
      from_line: fromLine,
      logs
    }
  };
});

export { consoleLog_get as default };
//# sourceMappingURL=console-log.get.mjs.map
