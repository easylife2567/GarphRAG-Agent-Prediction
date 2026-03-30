export default defineEventHandler(async (event) => {
    const simulationId = getRouterParam(event, 'simulationId') || 'mock_sim_123';
    return {
        success: true,
        data: {
            simulation_id: simulationId,
            project_id: 'mock_proj_123',
            status: 'ready',
        },
    };
});
