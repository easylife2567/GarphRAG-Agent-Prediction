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

const runStatus_get = defineEventHandler(async () => {
  mockState.runStatusCount += 1;
  const round = Math.min(8, mockState.runStatusCount);
  const completed = round >= 8;
  const twitterActions = round * 6;
  const redditActions = round * 6;
  return {
    success: true,
    data: {
      status: completed ? "completed" : "running",
      runner_status: completed ? "completed" : "running",
      total_rounds: 8,
      twitter_running: !completed,
      reddit_running: !completed,
      twitter_completed: completed,
      reddit_completed: completed,
      twitter_current_round: round,
      reddit_current_round: round,
      twitter_actions_count: twitterActions,
      reddit_actions_count: redditActions,
      twitter_simulated_hours: round * 0.5,
      reddit_simulated_hours: round * 0.5,
      total_actions: twitterActions + redditActions,
      current_round: round
    }
  };
});

export { runStatus_get as default };
//# sourceMappingURL=run-status.get.mjs.map
