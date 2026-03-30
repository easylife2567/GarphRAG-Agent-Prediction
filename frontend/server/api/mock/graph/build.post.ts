export default defineEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      project_id: 'mock_proj_123',
      task_id: 'mock_graph_task_123',
      message: 'Mock: 图谱构建任务已启动'
    }
  };
});