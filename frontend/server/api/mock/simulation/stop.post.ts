export default defineEventHandler(async () => {
    return {
        success: true,
        data: {
            status: 'stopped',
        },
    };
});
