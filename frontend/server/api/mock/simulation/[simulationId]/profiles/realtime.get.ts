import { mockProfiles, mockState } from '../../../_state';

export default defineEventHandler(async () => {
    const count = Math.min(mockProfiles.length, Math.max(1, mockState.preparePollCount));
    return {
        success: true,
        data: {
            profiles: mockProfiles.slice(0, count),
            total_expected: mockProfiles.length,
        },
    };
});
