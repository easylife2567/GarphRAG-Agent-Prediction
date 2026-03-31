import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const build_post = defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    data: {
      project_id: "mock_proj_123",
      task_id: "mock_graph_task_123",
      message: "Mock: \u56FE\u8C31\u6784\u5EFA\u4EFB\u52A1\u5DF2\u542F\u52A8"
    }
  };
});

export { build_post as default };
//# sourceMappingURL=build.post.mjs.map
