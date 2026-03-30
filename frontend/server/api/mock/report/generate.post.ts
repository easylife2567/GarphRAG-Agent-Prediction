import { mockState, step4SimulatedActions } from '../_state';

export default defineEventHandler(async () => {
    // Reset report mock state when generating a new report
    mockState.reportActions = [...step4SimulatedActions];
    
    return {
        success: true,
        data: {
            report_id: 'mock_report_123',
            status: 'generating',
        },
    };
});
