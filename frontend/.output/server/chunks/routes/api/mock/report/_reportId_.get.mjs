import { d as defineEventHandler, b as getRouterParam } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _reportId__get = defineEventHandler(async (event) => {
  const reportId = getRouterParam(event, "reportId") || "mock_report_123";
  return {
    success: true,
    data: {
      report_id: reportId,
      title: "Mock \u8206\u60C5\u63A8\u6F14\u62A5\u544A",
      summary: "\u8FD9\u662F\u57FA\u4E8E Mock \u6570\u636E\u751F\u6210\u7684\u62A5\u544A\u6458\u8981\u3002",
      content: "Mock \u62A5\u544A\u6B63\u6587\u5185\u5BB9\uFF0C\u7528\u4E8E\u8054\u8C03\u9875\u9762\u5C55\u793A\u3002"
    }
  };
});

export { _reportId__get as default };
//# sourceMappingURL=_reportId_.get.mjs.map
