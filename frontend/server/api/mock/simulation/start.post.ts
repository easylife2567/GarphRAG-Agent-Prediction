import { mockState } from '../_state';

export default defineEventHandler(async () => {
    mockState.runStatusCount = 0;
    mockState.reportDetailCount = 0;
    mockState.reportActions = []; // Reset the action logs

    return {
        success: true,
        data: {
            simulation_id: 'mock_sim_123',
            status: 'running',
        },
    };
});
