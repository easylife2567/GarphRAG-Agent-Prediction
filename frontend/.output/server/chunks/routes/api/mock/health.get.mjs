import { d as defineEventHandler, g as getRequestProtocol, a as getRequestHost } from '../../../nitro/nitro.mjs';
import { mockConfig, mockProfiles } from './_state.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const bool = (v) => !!v;
const health_get = defineEventHandler(
  async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const protocol = getRequestProtocol(event);
    const host = getRequestHost(event);
    const base = `${protocol}://${host}`;
    const probe = async (path, method = "GET") => {
      try {
        const res = await $fetch(`${base}${path}`, {
          method
        });
        return { ok: !!(res == null ? void 0 : res.success), data: res == null ? void 0 : res.data };
      } catch (error) {
        return { ok: false, data: null };
      }
    };
    const [
      graphProject,
      simCreate,
      simPrepare,
      simPrepareStatus,
      simConfigRealtime,
      simRunStatus,
      simRunDetail,
      reportGenerate,
      reportChat
    ] = await Promise.all([
      probe("/api/mock/graph/project"),
      probe("/api/mock/simulation/create", "POST"),
      probe("/api/mock/simulation/prepare", "POST"),
      probe("/api/mock/simulation/prepare/status", "POST"),
      probe("/api/mock/simulation/mock_sim_123/config/realtime"),
      probe("/api/mock/simulation/mock_sim_123/run-status"),
      probe("/api/mock/simulation/mock_sim_123/run-status/detail"),
      probe("/api/mock/report/generate", "POST"),
      probe("/api/mock/report/chat", "POST")
    ]);
    const checks = [
      {
        key: "graph-core",
        name: "\u56FE\u8C31\u9636\u6BB5\u6838\u5FC3 Mock \u5DF2\u914D\u7F6E",
        ok: graphProject.ok
      },
      {
        key: "config-time",
        name: "Step2 \u65F6\u95F4\u914D\u7F6E\u5B8C\u6574",
        ok: bool((_b = (_a = mockConfig) == null ? void 0 : _a.time_config) == null ? void 0 : _b.total_simulation_hours) && bool((_d = (_c = mockConfig) == null ? void 0 : _c.time_config) == null ? void 0 : _d.minutes_per_round)
      },
      {
        key: "config-event",
        name: "Step2 \u4E8B\u4EF6\u914D\u7F6E\u5B8C\u6574",
        ok: Array.isArray((_f = (_e = mockConfig) == null ? void 0 : _e.event_config) == null ? void 0 : _f.hot_topics) && Array.isArray((_h = (_g = mockConfig) == null ? void 0 : _g.event_config) == null ? void 0 : _h.initial_posts)
      },
      {
        key: "config-platform",
        name: "Step2 \u53CC\u5E73\u53F0\u914D\u7F6E\u5B8C\u6574",
        ok: bool((_i = mockConfig) == null ? void 0 : _i.twitter_config) && bool((_j = mockConfig) == null ? void 0 : _j.reddit_config)
      },
      {
        key: "profiles",
        name: "Step2 Agent Profiles \u53EF\u7528",
        ok: Array.isArray(mockProfiles) && mockProfiles.length > 0
      },
      {
        key: "run-status-shape",
        name: "Step3 \u8FD0\u884C\u72B6\u6001\u5B57\u6BB5\u5B8C\u6574",
        ok: simRunStatus.ok && bool((_k = simRunStatus.data) == null ? void 0 : _k.runner_status) && typeof ((_l = simRunStatus.data) == null ? void 0 : _l.twitter_actions_count) === "number" && typeof ((_m = simRunStatus.data) == null ? void 0 : _m.reddit_actions_count) === "number"
      },
      {
        key: "run-detail-shape",
        name: "Step3 \u52A8\u4F5C\u65F6\u95F4\u7EBF\u5B57\u6BB5\u5B8C\u6574",
        ok: simRunDetail.ok && Array.isArray((_n = simRunDetail.data) == null ? void 0 : _n.all_actions)
      },
      {
        key: "report-core",
        name: "Step4/5 \u62A5\u544A\u4E0E\u4E92\u52A8 Mock \u5DF2\u914D\u7F6E",
        ok: reportGenerate.ok && reportChat.ok
      },
      {
        key: "sim-create",
        name: "Step2 \u521B\u5EFA\u6A21\u62DF\u63A5\u53E3\u53EF\u7528",
        ok: simCreate.ok
      },
      {
        key: "sim-prepare",
        name: "Step2 \u51C6\u5907\u73AF\u5883\u63A5\u53E3\u53EF\u7528",
        ok: simPrepare.ok && simPrepareStatus.ok
      },
      {
        key: "sim-config",
        name: "Step2 \u914D\u7F6E\u5B9E\u65F6\u63A5\u53E3\u53EF\u7528",
        ok: simConfigRealtime.ok
      }
    ];
    return {
      success: true,
      data: {
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        checks
      }
    };
  }
);

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
