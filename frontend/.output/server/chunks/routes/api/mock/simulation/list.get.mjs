import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const list_get = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      simulations: [
        {
          simulation_id: "mock_sim_123",
          project_id: "mock_proj_123",
          status: "ready",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      total: 1
    }
  };
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
