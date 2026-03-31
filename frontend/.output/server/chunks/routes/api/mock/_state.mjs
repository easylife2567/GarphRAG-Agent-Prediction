const step4SimulatedActions = [
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "report_start",
    message: "Report generation started"
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "planning_complete",
    message: "Outline generated",
    details: {
      outline: {
        title: "Mock Report Title",
        summary: "Mock Report Summary",
        sections: [{ title: "Section 1" }, { title: "Section 2" }]
      }
    }
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "section_start",
    section_index: 1,
    message: "Starting section 1"
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "section_complete",
    section_index: 1,
    details: { content: "Mock content for section 1" }
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "section_start",
    section_index: 2,
    message: "Starting section 2"
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "section_complete",
    section_index: 2,
    details: { content: "Mock content for section 2" }
  },
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    action: "report_complete",
    message: "Report generated completely"
  }
];
const mockState = {
  preparePollCount: 0,
  runStatusCount: 0,
  reportDetailCount: 0,
  reportActions: [...step4SimulatedActions],
  runActions: []
};
const mockProfiles = [
  {
    id: "agent_1",
    name: "zhangsan",
    username: "\u5F20\u4E09",
    profession: "\u5B66\u751F",
    bio: "\u5173\u6CE8\u6559\u80B2\u4E0E\u6821\u56ED\u6CBB\u7406",
    interested_topics: ["\u6559\u80B2\u516C\u5E73", "\u6821\u56ED\u7BA1\u7406"],
    entity_type: "Person"
  },
  {
    id: "agent_2",
    name: "lisi",
    username: "\u674E\u56DB",
    profession: "\u5A92\u4F53\u4ECE\u4E1A\u8005",
    bio: "\u5173\u6CE8\u516C\u5171\u4E8B\u4EF6\u4F20\u64AD\u4E0E\u8206\u8BBA\u6F14\u5316",
    interested_topics: ["\u8206\u8BBA\u4F20\u64AD", "\u5371\u673A\u516C\u5173"],
    entity_type: "Person"
  },
  {
    id: "agent_3",
    name: "wangwu",
    username: "\u738B\u4E94",
    profession: "\u5BB6\u957F",
    bio: "\u5173\u6CE8\u653F\u7B56\u6267\u884C\u5BF9\u5BB6\u5EAD\u7684\u5F71\u54CD",
    interested_topics: ["\u5BB6\u5EAD\u6559\u80B2", "\u653F\u7B56\u5F71\u54CD"],
    entity_type: "Person"
  }
];
const mockConfig = {
  time_config: {
    total_simulation_hours: 20,
    minutes_per_round: 30,
    agents_per_hour_min: 20,
    agents_per_hour_max: 80,
    peak_hours: [10, 11, 20, 21],
    peak_activity_multiplier: 1.5,
    work_hours: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    work_activity_multiplier: 1.2,
    morning_hours: [7, 8],
    morning_activity_multiplier: 1.1,
    off_peak_hours: [1, 2, 3, 4, 5],
    off_peak_activity_multiplier: 0.6
  },
  event_config: {
    narrative_direction: "\u56F4\u7ED5\u6821\u56ED\u6CBB\u7406\u4E0E\u8206\u8BBA\u6F14\u5316\u7684\u591A\u5E73\u53F0\u8BA8\u8BBA",
    hot_topics: ["\u6821\u56ED\u6CBB\u7406", "\u8206\u8BBA\u6269\u6563", "\u653F\u7B56\u6C9F\u901A"],
    initial_posts: [
      {
        poster_type: "core",
        poster_agent_id: 0,
        content: "\u4E8B\u4EF6\u516C\u5F00\u540E\uFF0C\u662F\u5426\u9700\u8981\u66F4\u900F\u660E\u7684\u4FE1\u606F\u62AB\u9732\u673A\u5236\uFF1F"
      },
      {
        poster_type: "media",
        poster_agent_id: 1,
        content: "\u591A\u65B9\u89C2\u70B9\u5F00\u59CB\u6C47\u805A\uFF0C\u8BA8\u8BBA\u7126\u70B9\u8F6C\u5411\u6267\u884C\u6D41\u7A0B\u4E0E\u95EE\u8D23\u673A\u5236\u3002"
      }
    ]
  },
  twitter_config: {
    recency_weight: 0.5,
    popularity_weight: 0.3,
    relevance_weight: 0.2,
    viral_threshold: 0.75,
    echo_chamber_strength: 0.6
  },
  reddit_config: {
    recency_weight: 0.35,
    popularity_weight: 0.4,
    relevance_weight: 0.25,
    viral_threshold: 0.7,
    echo_chamber_strength: 0.55
  },
  generation_reasoning: "\u6839\u636E\u73B0\u5B9E\u79CD\u5B50\u4F18\u5148\u8BBE\u7F6E\u4E2D\u9AD8\u6D3B\u8DC3\u65F6\u6BB5\u4E0E\u51B2\u7A81\u8BAE\u9898\u6269\u6563\u8DEF\u5F84|\u901A\u8FC7\u5E73\u53F0\u6743\u91CD\u5DEE\u5F02\u6A21\u62DF\u4FE1\u606F\u5728\u77ED\u6587\u672C\u4E0E\u957F\u8BA8\u8BBA\u573A\u666F\u4E0B\u7684\u4F20\u64AD\u5DEE\u522B",
  agent_configs: [
    {
      agent_id: 0,
      entity_name: "\u5F20\u4E09",
      entity_type: "Person",
      stance: "neutral",
      active_hours: [8, 9, 10, 20, 21],
      posts_per_hour: 2,
      comments_per_hour: 6,
      response_delay_min: 2,
      response_delay_max: 10,
      activity_level: 0.7,
      sentiment_bias: 0.1,
      influence_weight: 0.5
    },
    {
      agent_id: 1,
      entity_name: "\u674E\u56DB",
      entity_type: "Person",
      stance: "positive",
      active_hours: [9, 10, 11, 19, 20],
      posts_per_hour: 3,
      comments_per_hour: 8,
      response_delay_min: 1,
      response_delay_max: 8,
      activity_level: 0.8,
      sentiment_bias: 0.3,
      influence_weight: 0.7
    }
  ]
};

export { mockConfig, mockProfiles, mockState, step4SimulatedActions };
//# sourceMappingURL=_state.mjs.map
