export default defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      project_id: 'mock_proj_123',
      name: 'Mock Project',
      status: 'graph_completed', // created, ontology_generated, graph_building, graph_completed, failed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      files: [{ filename: 'mock_document.pdf', size: 102400 }],
      total_text_length: 5000,
      ontology: {
        entity_types: ['Person', 'Organization', 'Location', 'Event'],
        edge_types: ['WorksFor', 'LocatedIn', 'ParticipatedIn']
      },
      analysis_summary: 'Mock: 这是通过模拟生成的文档分析总结...',
      graph_id: 'mock_graph_123',
      graph_build_task_id: 'mock_graph_task_123',
      simulation_requirement: 'Mock: 测试需求',
      chunk_size: 500,
      chunk_overlap: 50
    }
  };
});