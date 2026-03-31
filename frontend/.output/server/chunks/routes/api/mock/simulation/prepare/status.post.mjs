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

const status_post = defineEventHandler(async () => {
  mockState.preparePollCount += 1;
  const count = mockState.preparePollCount;
  if (count < 2) {
    return {
      success: true,
      data: {
        status: "processing",
        progress: 30,
        progress_detail: {
          current_stage: "generating_profiles",
          current_stage_name: "\u751F\u6210Agent\u4EBA\u8BBE",
          stage_index: 1,
          total_stages: 3,
          current_item: 1,
          total_items: 3,
          item_description: "\u6B63\u5728\u521D\u59CB\u5316\u9996\u6279Agent\u4EBA\u8BBE"
        }
      }
    };
  }
  if (count < 4) {
    return {
      success: true,
      data: {
        status: "processing",
        progress: 75,
        progress_detail: {
          current_stage: "generating_config",
          current_stage_name: "\u751F\u6210\u6A21\u62DF\u914D\u7F6E",
          stage_index: 2,
          total_stages: 3,
          current_item: 2,
          total_items: 3,
          item_description: "\u6B63\u5728\u751F\u6210\u53CC\u5E73\u53F0\u6A21\u62DF\u53C2\u6570"
        }
      }
    };
  }
  return {
    success: true,
    data: {
      status: "completed",
      progress: 100,
      already_prepared: true,
      message: "\u51C6\u5907\u5B8C\u6210"
    }
  };
});

export { status_post as default };
//# sourceMappingURL=status.post.mjs.map
