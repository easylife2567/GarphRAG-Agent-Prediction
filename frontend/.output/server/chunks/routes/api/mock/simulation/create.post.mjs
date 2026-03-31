import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const create_post = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      simulation_id: "mock_sim_123",
      project_id: "mock_proj_123",
      status: "created"
    }
  };
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
