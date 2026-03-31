import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const generate_post = defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    data: {
      project_id: "mock_proj_123",
      ontology: {
        entity_types: ["Person", "Organization", "Location", "Event"],
        edge_types: ["WorksFor", "LocatedIn", "ParticipatedIn"]
      },
      analysis_summary: "Mock: \u8FD9\u662F\u901A\u8FC7\u6A21\u62DF\u751F\u6210\u7684\u6587\u6863\u5206\u6790\u603B\u7ED3...",
      files: [{ filename: "mock_document.pdf", size: 102400 }],
      total_text_length: 5e3
    }
  };
});

export { generate_post as default };
//# sourceMappingURL=generate.post.mjs.map
