import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import { mockState } from '../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const timeline_get = defineEventHandler(() => {
  const buckets = {};
  (mockState.runActions || []).forEach((a) => {
    const key = String(a.round_num || 1);
    buckets[key] = (buckets[key] || 0) + 1;
  });
  const timeline = Object.entries(buckets).map(([round, actions]) => ({
    round_num: Number(round),
    actions_count: actions
  }));
  return {
    success: true,
    data: {
      timeline
    }
  };
});

export { timeline_get as default };
//# sourceMappingURL=timeline.get.mjs.map
