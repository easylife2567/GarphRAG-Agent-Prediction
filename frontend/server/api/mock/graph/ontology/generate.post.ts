export default defineEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    data: {
      project_id: 'mock_proj_123',
      ontology: {
        entity_types: ['Person', 'Organization', 'Location', 'Event'],
        edge_types: ['WorksFor', 'LocatedIn', 'ParticipatedIn']
      },
      analysis_summary: 'Mock: 这是通过模拟生成的文档分析总结...',
      files: [{ filename: 'mock_document.pdf', size: 102400 }],
      total_text_length: 5000
    }
  };
});
