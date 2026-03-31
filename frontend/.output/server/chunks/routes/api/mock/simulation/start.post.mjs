import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { mockState } from '../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const start_post = defineEventHandler(async () => {
  mockState.runStatusCount = 0;
  mockState.reportDetailCount = 0;
  mockState.reportActions = [];
  return {
    success: true,
    data: {
      simulation_id: "mock_sim_123",
      status: "running"
    }
  };
});

export { start_post as default };
//# sourceMappingURL=start.post.mjs.map
