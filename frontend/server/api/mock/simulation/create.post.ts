export default defineEventHandler(async () => {
    return {
        success: true,
        data: {
            simulation_id: 'mock_sim_123',
            project_id: 'mock_proj_123',
            status: 'created',
        },
    };
});
