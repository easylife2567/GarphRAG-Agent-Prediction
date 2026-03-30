import { mockState } from '../../_state';

export default defineEventHandler(() => {
    return {
        success: true,
        data: {
            actions: mockState.runActions || [],
        },
    };
});
