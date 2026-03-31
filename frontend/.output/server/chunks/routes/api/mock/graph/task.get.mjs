import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

let requestCount = 0;
const task_get = defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  requestCount++;
  if (requestCount <= 2) {
    return {
      success: true,
      data: {
        task_id: "mock_graph_task_123",
        status: "processing",
        progress: requestCount * 40,
        // 40%, 80%
        message: "Mock: \u6B63\u5728\u6784\u5EFA\u56FE\u8C31\u4E2D..."
      }
    };
  } else {
    requestCount = 0;
    return {
      success: true,
      data: {
        task_id: "mock_graph_task_123",
        status: "completed",
        progress: 100,
        message: "Mock: \u6784\u5EFA\u5B8C\u6210",
        result: {
          project_id: "mock_proj_123",
          graph_id: "mock_graph_123",
          node_count: 42,
          edge_count: 88,
          chunk_count: 10
        }
      }
    };
  }
});

export { task_get as default };
//# sourceMappingURL=task.get.mjs.map
