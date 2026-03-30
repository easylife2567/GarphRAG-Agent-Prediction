import { mockState } from '../../_state';

export default defineEventHandler(() => {
    const list = (mockState.runActions || []).map((a: any, idx: number) => ({
        id: `post_${idx + 1}`,
        platform: a.platform,
        content: a.action_args?.content || '',
        round_num: a.round_num || 1,
        timestamp: a.timestamp,
    }));
    return {
        success: true,
        data: {
            posts: list,
        },
    };
});
