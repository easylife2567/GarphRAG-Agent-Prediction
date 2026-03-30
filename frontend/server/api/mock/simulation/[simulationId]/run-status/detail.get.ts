import { mockState } from '../../../_state';

export default defineEventHandler(async () => {
    mockState.reportDetailCount += 1;
    const idx = mockState.reportDetailCount;
    const actions = [
        {
            id: `a_${idx}_1`,
            platform: 'twitter',
            action_type: 'CREATE_POST',
            agent_id: 'agent_1',
            username: '张三',
            display_name: '张三',
            avatar: '',
            action_args: {
                content: `第 ${idx} 轮：平台情绪持续发酵`,
            },
            round_num: Math.min(8, idx),
            timestamp: new Date().toISOString(),
        },
        {
            id: `a_${idx}_2`,
            platform: 'reddit',
            action_type: 'CREATE_COMMENT',
            agent_id: 'agent_2',
            username: '李四',
            display_name: '李四',
            avatar: '',
            action_args: {
                content: `第 ${idx} 轮：出现新的观点分歧`,
            },
            round_num: Math.min(8, idx),
            timestamp: new Date().toISOString(),
        },
    ];
    mockState.runActions = mockState.runActions || [];
    mockState.runActions.push(...actions);
    return {
        success: true,
        data: {
            all_actions: mockState.runActions,
            recent_actions: actions,
        },
    };
});
