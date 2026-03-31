import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { step4SimulatedActions, mockState } from '../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const generate_post = defineEventHandler(async () => {
  mockState.reportActions = [...step4SimulatedActions];
  return {
    success: true,
    data: {
      report_id: "mock_report_123",
      status: "generating"
    }
  };
});

export { generate_post as default };
//# sourceMappingURL=generate.post.mjs.map
