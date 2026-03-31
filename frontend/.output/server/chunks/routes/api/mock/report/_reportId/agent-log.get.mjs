import { d as defineEventHandler, c as getQuery } from '../../../../../nitro/nitro.mjs';
import { mockState, step4SimulatedActions } from '../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const agentLog_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fromLine = Number(query.from_line) || 0;
  const allLogs = Array.isArray(mockState.reportActions) && mockState.reportActions.length > 0 ? mockState.reportActions : step4SimulatedActions;
  const limit = 2;
  const logs = allLogs.slice(fromLine, fromLine + limit);
  return {
    success: true,
    data: {
      from_line: fromLine,
      logs
    }
  };
});

export { agentLog_get as default };
//# sourceMappingURL=agent-log.get.mjs.map
