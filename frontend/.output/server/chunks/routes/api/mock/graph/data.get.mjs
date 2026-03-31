import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const data_get = defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      nodes: [
        { id: "1", label: "Entity 1", labels: ["Person"] },
        { id: "2", label: "Entity 2", labels: ["Organization"] }
      ],
      edges: [
        { source: "1", target: "2", label: "WorksFor" }
      ],
      node_count: 2,
      edge_count: 1
    }
  };
});

export { data_get as default };
//# sourceMappingURL=data.get.mjs.map
