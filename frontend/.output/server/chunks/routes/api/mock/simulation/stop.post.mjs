import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const stop_post = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      status: "stopped"
    }
  };
});

export { stop_post as default };
//# sourceMappingURL=stop.post.mjs.map
