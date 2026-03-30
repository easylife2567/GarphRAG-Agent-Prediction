export default defineEventHandler(async () => {
    return {
        success: true,
        data: {
            status: 'completed',
            progress: 100,
        },
    };
});
