export default defineEventHandler(async () => {
    return {
        success: true,
        data: {
            answer: '这是 Mock Report Agent 的回复，用于验证互动流程。',
        },
    };
});
