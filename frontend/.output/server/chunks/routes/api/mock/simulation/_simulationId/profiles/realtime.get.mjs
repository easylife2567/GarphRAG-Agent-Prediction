import { d as defineEventHandler } from '../../../../../../nitro/nitro.mjs';
import { mockProfiles, mockState } from '../../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const realtime_get = defineEventHandler(async () => {
  const count = Math.min(mockProfiles.length, Math.max(1, mockState.preparePollCount));
  return {
    success: true,
    data: {
      profiles: mockProfiles.slice(0, count),
      total_expected: mockProfiles.length
    }
  };
});

export { realtime_get as default };
//# sourceMappingURL=realtime.get.mjs.map
