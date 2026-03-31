import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import { mockProfiles, mockState } from '../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const agentStats_get = defineEventHandler(() => {
  const stats = mockProfiles.map((p) => ({
    agent_id: p.id,
    username: p.username,
    actions_count: (mockState.runActions || []).filter((a) => a.agent_id === p.id).length
  }));
  return {
    success: true,
    data: {
      stats
    }
  };
});

export { agentStats_get as default };
//# sourceMappingURL=agent-stats.get.mjs.map
