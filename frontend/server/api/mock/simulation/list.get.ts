export default defineEventHandler(async () => {
    return {
        success: true,
        data: {
            simulations: [
                {
                    simulation_id: 'mock_sim_123',
                    project_id: 'mock_proj_123',
                    status: 'ready',
                    created_at: new Date().toISOString(),
                },
            ],
            total: 1,
        },
    };
});
