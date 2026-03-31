import { d as defineEventHandler } from '../../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const batch_post = defineEventHandler(() => {
  return {
    success: true,
    data: {
      interviews: [
        {
          agent_id: "agent_1",
          answer: "Mock \u91C7\u8BBF\u56DE\u7B54\uFF1A\u5F53\u524D\u8BA8\u8BBA\u5DF2\u7ECF\u8FDB\u5165\u89C2\u70B9\u5206\u5316\u9636\u6BB5\u3002"
        }
      ]
    }
  };
});

export { batch_post as default };
//# sourceMappingURL=batch.post.mjs.map
