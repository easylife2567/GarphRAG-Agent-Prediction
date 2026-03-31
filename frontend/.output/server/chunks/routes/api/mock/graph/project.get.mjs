import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const project_get = defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      project_id: "mock_proj_123",
      name: "Mock Project",
      status: "graph_completed",
      // created, ontology_generated, graph_building, graph_completed, failed
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      files: [{ filename: "mock_document.pdf", size: 102400 }],
      total_text_length: 5e3,
      ontology: {
        entity_types: ["Person", "Organization", "Location", "Event"],
        edge_types: ["WorksFor", "LocatedIn", "ParticipatedIn"]
      },
      analysis_summary: "Mock: \u8FD9\u662F\u901A\u8FC7\u6A21\u62DF\u751F\u6210\u7684\u6587\u6863\u5206\u6790\u603B\u7ED3...",
      graph_id: "mock_graph_123",
      graph_build_task_id: "mock_graph_task_123",
      simulation_requirement: "Mock: \u6D4B\u8BD5\u9700\u6C42",
      chunk_size: 500,
      chunk_overlap: 50
    }
  };
});

export { project_get as default };
//# sourceMappingURL=project.get.mjs.map
