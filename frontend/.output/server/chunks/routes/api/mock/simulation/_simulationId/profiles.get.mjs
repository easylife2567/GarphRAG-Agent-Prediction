import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import { mockProfiles } from '../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const profiles_get = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      profiles: mockProfiles
    }
  };
});

export { profiles_get as default };
//# sourceMappingURL=profiles.get.mjs.map
