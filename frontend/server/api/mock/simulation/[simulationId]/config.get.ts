import { mockConfig } from '../../_state';

export default defineEventHandler(async () => {
    return {
        success: true,
        data: mockConfig,
    };
});
