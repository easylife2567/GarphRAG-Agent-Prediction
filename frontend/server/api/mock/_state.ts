export const step4SimulatedActions = [
    {
        timestamp: new Date().toISOString(),
        action: 'report_start',
        message: 'Report generation started',
    },
    {
        timestamp: new Date().toISOString(),
        action: 'planning_complete',
        message: 'Outline generated',
        details: {
            outline: {
                title: 'Mock Report Title',
                summary: 'Mock Report Summary',
                sections: [{ title: 'Section 1' }, { title: 'Section 2' }],
            },
        },
    },
    {
        timestamp: new Date().toISOString(),
        action: 'section_start',
        section_index: 1,
        message: 'Starting section 1',
    },
    {
        timestamp: new Date().toISOString(),
        action: 'section_complete',
        section_index: 1,
        details: { content: 'Mock content for section 1' },
    },
    {
        timestamp: new Date().toISOString(),
        action: 'section_start',
        section_index: 2,
        message: 'Starting section 2',
    },
    {
        timestamp: new Date().toISOString(),
        action: 'section_complete',
        section_index: 2,
        details: { content: 'Mock content for section 2' },
    },
    {
        timestamp: new Date().toISOString(),
        action: 'report_complete',
        message: 'Report generated completely',
    },
];

export const mockState = {
    preparePollCount: 0,
    runStatusCount: 0,
    reportDetailCount: 0,
    reportActions: [...step4SimulatedActions],
    runActions: [] as any[],
};

export const mockProfiles = [
    {
        id: 'agent_1',
        name: 'zhangsan',
        username: '张三',
        profession: '学生',
        bio: '关注教育与校园治理',
        interested_topics: ['教育公平', '校园管理'],
        entity_type: 'Person',
    },
    {
        id: 'agent_2',
        name: 'lisi',
        username: '李四',
        profession: '媒体从业者',
        bio: '关注公共事件传播与舆论演化',
        interested_topics: ['舆论传播', '危机公关'],
        entity_type: 'Person',
    },
    {
        id: 'agent_3',
        name: 'wangwu',
        username: '王五',
        profession: '家长',
        bio: '关注政策执行对家庭的影响',
        interested_topics: ['家庭教育', '政策影响'],
        entity_type: 'Person',
    },
];

export const mockConfig = {
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
        off_peak_activity_multiplier: 0.6,
    },
    event_config: {
        narrative_direction: '围绕校园治理与舆论演化的多平台讨论',
        hot_topics: ['校园治理', '舆论扩散', '政策沟通'],
        initial_posts: [
            {
                poster_type: 'core',
                poster_agent_id: 0,
                content: '事件公开后，是否需要更透明的信息披露机制？',
            },
            {
                poster_type: 'media',
                poster_agent_id: 1,
                content: '多方观点开始汇聚，讨论焦点转向执行流程与问责机制。',
            },
        ],
    },
    twitter_config: {
        recency_weight: 0.5,
        popularity_weight: 0.3,
        relevance_weight: 0.2,
        viral_threshold: 0.75,
        echo_chamber_strength: 0.6,
    },
    reddit_config: {
        recency_weight: 0.35,
        popularity_weight: 0.4,
        relevance_weight: 0.25,
        viral_threshold: 0.7,
        echo_chamber_strength: 0.55,
    },
    generation_reasoning:
        '根据现实种子优先设置中高活跃时段与冲突议题扩散路径|通过平台权重差异模拟信息在短文本与长讨论场景下的传播差别',
    agent_configs: [
        {
            agent_id: 0,
            entity_name: '张三',
            entity_type: 'Person',
            stance: 'neutral',
            active_hours: [8, 9, 10, 20, 21],
            posts_per_hour: 2,
            comments_per_hour: 6,
            response_delay_min: 2,
            response_delay_max: 10,
            activity_level: 0.7,
            sentiment_bias: 0.1,
            influence_weight: 0.5,
        },
        {
            agent_id: 1,
            entity_name: '李四',
            entity_type: 'Person',
            stance: 'positive',
            active_hours: [9, 10, 11, 19, 20],
            posts_per_hour: 3,
            comments_per_hour: 8,
            response_delay_min: 1,
            response_delay_max: 8,
            activity_level: 0.8,
            sentiment_bias: 0.3,
            influence_weight: 0.7,
        },
    ],
};
