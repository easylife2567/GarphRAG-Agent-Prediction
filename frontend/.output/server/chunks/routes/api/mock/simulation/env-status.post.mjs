import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const envStatus_post = defineEventHandler(() => {
  return {
    success: true,
    data: {
      status: "running"
    }
  };
});

export { envStatus_post as default };
//# sourceMappingURL=env-status.post.mjs.map
