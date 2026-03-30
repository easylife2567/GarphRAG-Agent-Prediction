import { mockState } from '../_state';

export default defineEventHandler(async () => {
    mockState.preparePollCount = 0;
    return {
        success: true,
        data: {
            task_id: 'mock_prepare_task_123',
            expected_entities_count: 3,
            entity_types: ['Person'],
            already_prepared: false,
        },
    };
});
