import { mockProfiles, mockState } from '../../_state';

export default defineEventHandler(() => {
    const stats = mockProfiles.map((p: any) => ({
        agent_id: p.id,
        username: p.username,
        actions_count: (mockState.runActions || []).filter((a: any) => a.agent_id === p.id).length,
    }));
    return {
        success: true,
        data: {
            stats,
        },
    };
});
