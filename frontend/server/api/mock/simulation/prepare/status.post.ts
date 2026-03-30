import { mockState } from '../../_state';

export default defineEventHandler(async () => {
    mockState.preparePollCount += 1;
    const count = mockState.preparePollCount;

    if (count < 2) {
        return {
            success: true,
            data: {
                status: 'processing',
                progress: 30,
                progress_detail: {
                    current_stage: 'generating_profiles',
                    current_stage_name: '生成Agent人设',
                    stage_index: 1,
                    total_stages: 3,
                    current_item: 1,
                    total_items: 3,
                    item_description: '正在初始化首批Agent人设',
                },
            },
        };
    }

    if (count < 4) {
        return {
            success: true,
            data: {
                status: 'processing',
                progress: 75,
                progress_detail: {
                    current_stage: 'generating_config',
                    current_stage_name: '生成模拟配置',
                    stage_index: 2,
                    total_stages: 3,
                    current_item: 2,
                    total_items: 3,
                    item_description: '正在生成双平台模拟参数',
                },
            },
        };
    }

    return {
        success: true,
        data: {
            status: 'completed',
            progress: 100,
            already_prepared: true,
            message: '准备完成',
        },
    };
});
