import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const chat_post = defineEventHandler(async () => {
  return {
    success: true,
    data: {
      answer: "\u8FD9\u662F Mock Report Agent \u7684\u56DE\u590D\uFF0C\u7528\u4E8E\u9A8C\u8BC1\u4E92\u52A8\u6D41\u7A0B\u3002"
    }
  };
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
