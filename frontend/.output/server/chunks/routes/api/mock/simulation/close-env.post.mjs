import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const closeEnv_post = defineEventHandler(() => {
  return {
    success: true,
    data: {
      status: "closed"
    }
  };
});

export { closeEnv_post as default };
//# sourceMappingURL=close-env.post.mjs.map
