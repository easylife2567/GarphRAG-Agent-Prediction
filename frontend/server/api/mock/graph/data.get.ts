export default defineEventHandler(async (event) => {
  return {
    success: true,
    data: {
      nodes: [
        { id: '1', label: 'Entity 1', labels: ['Person'] },
        { id: '2', label: 'Entity 2', labels: ['Organization'] }
      ],
      edges: [
        { source: '1', target: '2', label: 'WorksFor' }
      ],
      node_count: 2,
      edge_count: 1
    }
  };
});