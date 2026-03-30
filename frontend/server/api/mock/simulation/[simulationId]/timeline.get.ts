import { mockState } from '../../_state';

export default defineEventHandler(() => {
    const buckets: Record<string, number> = {};
    (mockState.runActions || []).forEach((a: any) => {
        const key = String(a.round_num || 1);
        buckets[key] = (buckets[key] || 0) + 1;
    });
    const timeline = Object.entries(buckets).map(([round, actions]) => ({
        round_num: Number(round),
        actions_count: actions,
    }));
    return {
        success: true,
        data: {
            timeline,
        },
    };
});
