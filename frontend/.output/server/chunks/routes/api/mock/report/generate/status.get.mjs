import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const status_get = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      status: "completed",
      progress: 100
    }
  };
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
