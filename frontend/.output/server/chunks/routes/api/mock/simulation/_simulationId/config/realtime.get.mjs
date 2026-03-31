import { d as defineEventHandler } from '../../../../../../nitro/nitro.mjs';
import { mockState, mockConfig, mockProfiles } from '../../../_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const realtime_get = defineEventHandler(async () => {
  const generating = mockState.preparePollCount < 3;
  return {
    success: true,
    data: {
      generation_stage: generating ? "generating_config" : "completed",
      config_generated: !generating,
      config: generating ? null : mockConfig,
      summary: generating ? null : {
        total_agents: mockProfiles.length,
        simulation_hours: mockConfig.time_config.total_simulation_hours,
        initial_posts_count: 8,
        hot_topics_count: 3,
        has_twitter_config: true,
        has_reddit_config: true
      }
    }
  };
});

export { realtime_get as default };
//# sourceMappingURL=realtime.get.mjs.map
