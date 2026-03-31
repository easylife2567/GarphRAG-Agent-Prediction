import { d as defineEventHandler, b as getRouterParam } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _simulationId__get = defineEventHandler(async (event) => {
  const simulationId = getRouterParam(event, "simulationId") || "mock_sim_123";
  return {
    success: true,
    data: {
      simulation_id: simulationId,
      project_id: "mock_proj_123",
      status: "ready"
    }
  };
});

export { _simulationId__get as default };
//# sourceMappingURL=_simulationId_.get.mjs.map
