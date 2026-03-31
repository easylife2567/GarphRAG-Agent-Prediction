import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import { mockConfig } from '../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const config_get = defineEventHandler(async () => {
  return {
    success: true,
    data: mockConfig
  };
});

export { config_get as default };
//# sourceMappingURL=config.get.mjs.map
