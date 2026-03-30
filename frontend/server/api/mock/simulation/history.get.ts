export default defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      simulations: [
        {
          simulation_id: 'mock_sim_123',
          project_id: 'mock_proj_123',
          status: 'completed',
          created_at: new Date().toISOString(),
          project_name: 'Mock Project'
        }
      ],
      total: 1
    }
  };
});
