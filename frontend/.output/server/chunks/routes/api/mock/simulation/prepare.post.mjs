import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { mockState } from '../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const prepare_post = defineEventHandler(async () => {
  mockState.preparePollCount = 0;
  return {
    success: true,
    data: {
      task_id: "mock_prepare_task_123",
      expected_entities_count: 3,
      entity_types: ["Person"],
      already_prepared: false
    }
  };
});

export { prepare_post as default };
//# sourceMappingURL=prepare.post.mjs.map
