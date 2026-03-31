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

const posts_get = defineEventHandler(() => {
  const list = (mockState.runActions || []).map((a, idx) => {
    var _a;
    return {
      id: `post_${idx + 1}`,
      platform: a.platform,
      content: ((_a = a.action_args) == null ? void 0 : _a.content) || "",
      round_num: a.round_num || 1,
      timestamp: a.timestamp
    };
  });
  return {
    success: true,
    data: {
      posts: list
    }
  };
});

export { posts_get as default };
//# sourceMappingURL=posts.get.mjs.map
