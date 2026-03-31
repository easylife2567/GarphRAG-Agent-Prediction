import { d as defineEventHandler } from '../../../../../../nitro/nitro.mjs';
import { mockState } from '../../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const detail_get = defineEventHandler(async () => {
  mockState.reportDetailCount += 1;
  const idx = mockState.reportDetailCount;
  const actions = [
    {
      id: `a_${idx}_1`,
      platform: "twitter",
      action_type: "CREATE_POST",
      agent_id: "agent_1",
      username: "\u5F20\u4E09",
      display_name: "\u5F20\u4E09",
      avatar: "",
      action_args: {
        content: `\u7B2C ${idx} \u8F6E\uFF1A\u5E73\u53F0\u60C5\u7EEA\u6301\u7EED\u53D1\u9175`
      },
      round_num: Math.min(8, idx),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: `a_${idx}_2`,
      platform: "reddit",
      action_type: "CREATE_COMMENT",
      agent_id: "agent_2",
      username: "\u674E\u56DB",
      display_name: "\u674E\u56DB",
      avatar: "",
      action_args: {
        content: `\u7B2C ${idx} \u8F6E\uFF1A\u51FA\u73B0\u65B0\u7684\u89C2\u70B9\u5206\u6B67`
      },
      round_num: Math.min(8, idx),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  mockState.runActions = mockState.runActions || [];
  mockState.runActions.push(...actions);
  return {
    success: true,
    data: {
      all_actions: mockState.runActions,
      recent_actions: actions
    }
  };
});

export { detail_get as default };
//# sourceMappingURL=detail.get.mjs.map
