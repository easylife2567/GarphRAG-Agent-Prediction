import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const history_get = defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      simulations: [
        {
          simulation_id: "mock_sim_123",
          project_id: "mock_proj_123",
          status: "completed",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          project_name: "Mock Project"
        }
      ],
      total: 1
    }
  };
});

export { history_get as default };
//# sourceMappingURL=history.get.mjs.map
