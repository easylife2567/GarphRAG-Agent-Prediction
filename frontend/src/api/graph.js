import service, { requestWithRetry } from './index';

/**
 * 生成本体（上传文档和模拟需求）
 * @param {Object} data - 包含files, simulation_requirement, project_name等
 * @returns {Promise}
 */
export function generateOntology(formData) {
    return requestWithRetry(() =>
        service({
            url: '/graph/ontology/generate',
            method: 'post',
            data: formData,
            // Let fetch automatically set the Content-Type with boundary for FormData
        })
    );
}

/**
 * 构建图谱
 * @param {Object} data - 包含project_id, graph_name等
 * @returns {Promise}
 */
export function buildGraph(data) {
    return requestWithRetry(() =>
        service({
            url: '/graph/build',
            method: 'post',
            data,
        })
    );
}

/**
 * 查询任务状态
 * @param {String} taskId - 任务ID
 * @returns {Promise}
 */
export function getTaskStatus(taskId) {
    return requestWithRetry(() =>
        service({
            url: `/graph/task/${taskId}`,
            method: 'get',
        })
    );
}

/**
 * 获取图谱数据
 * @param {String} graphId - 图谱ID
 * @returns {Promise}
 */
export function getGraphData(graphId) {
    return requestWithRetry(() =>
        service({
            url: `/graph/data/${graphId}`,
            method: 'get',
        })
    );
}

/**
 * 获取项目信息
 * @param {String} projectId - 项目ID
 * @returns {Promise}
 */
export function getProject(projectId) {
    return requestWithRetry(() =>
        service({
            url: `/graph/project/${projectId}`,
            method: 'get',
        })
    );
}
