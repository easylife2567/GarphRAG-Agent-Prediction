let requestCount = 0;

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  requestCount++;

  if (requestCount <= 2) {
    return {
      success: true,
      data: {
        task_id: 'mock_graph_task_123',
        status: 'processing',
        progress: requestCount * 40, // 40%, 80%
        message: 'Mock: 正在构建图谱中...'
      }
    };
  } else {
    requestCount = 0; // Reset for next time
    return {
      success: true,
      data: {
        task_id: 'mock_graph_task_123',
        status: 'completed',
        progress: 100,
        message: 'Mock: 构建完成',
        result: {
          project_id: 'mock_proj_123',
          graph_id: 'mock_graph_123',
          node_count: 42,
          edge_count: 88,
          chunk_count: 10
        }
      }
    };
  }
});
