import { $fetch } from 'ofetch';

const getPublicRuntimeConfig = () => {
    if (typeof globalThis !== 'undefined' && globalThis.__NUXT__?.config?.public) {
        return globalThis.__NUXT__.config.public;
    }
    return {};
};

const isMockModeEnabled = () => {
    const runtimeConfig = getPublicRuntimeConfig();
    // 首先检查运行时配置
    if (typeof runtimeConfig.mockMode !== 'undefined') {
        if (typeof runtimeConfig.mockMode === 'boolean') return runtimeConfig.mockMode;
        if (typeof runtimeConfig.mockMode === 'string') return runtimeConfig.mockMode === 'true';
    }

    // 如果没有获取到运行时配置，再尝试获取环境变量
    if (typeof process !== 'undefined' && process.env?.NUXT_PUBLIC_MOCK_MODE) {
        return process.env.NUXT_PUBLIC_MOCK_MODE !== 'false';
    }

    // 默认开启 Mock
    return true;
};

const getApiBase = () => {
    const runtimeConfig = getPublicRuntimeConfig();
    if (runtimeConfig.apiBase) return runtimeConfig.apiBase;
    if (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) {
        return process.env.VITE_API_BASE_URL;
    }
    return 'http://localhost:5001/api';
};

// Create a custom fetch instance with interceptors
const fetchInstance = $fetch.create({
    baseURL: isMockModeEnabled() ? '/api/mock' : getApiBase(),
    timeout: 3600000, // 增加到 1 小时 (60 分钟)，以支持长时间运行的生成任务
    headers: {
        // Remove default Content-Type to let fetch auto-set it for FormData
    },

    onRequest({ request, options }) {
        // Request interceptor logic
    },

    onResponse({ request, response, options }) {
        const res = response._data;

        // Mock 模式下拦截器需要能够正确返回数据
        // If the response code is not success, throw an error to be caught by the caller
        if (res && res.success === false) {
            console.error('API Error:', res.error || res.message || 'Unknown error');
            throw new Error(res.error || res.message || 'Error');
        }

        // 我们不应该在这里直接返回 res，因为 ofetch 会把 response._data 作为最终返回值。
        // 原本的代码没有 return，ofetch 默认会返回整个 JSON。这很好。
    },

    onResponseError({ request, response, options }) {
        console.error('Response error:', response?.status, response?._data);
        if (response?.status === 408) {
            console.error('Request timeout');
        }
    },
});

// Wrapper to mimic axios API for get/post so we don't have to change all API files right now
const service = function (config) {
    return service.request(config);
};

service.get = function (url, config = {}) {
    const options = { method: 'GET', ...config };
    if (config.params) {
        options.query = config.params;
        delete options.params;
    }
    return fetchInstance(url, options);
};

service.post = function (url, data, config = {}) {
    return fetchInstance(url, { method: 'POST', body: data, ...config });
};

service.put = function (url, data, config = {}) {
    return fetchInstance(url, { method: 'PUT', body: data, ...config });
};

service.delete = function (url, config = {}) {
    const options = { method: 'DELETE', ...config };
    if (config.params) {
        options.query = config.params;
        delete options.params;
    }
    return fetchInstance(url, options);
};

// To support FormData without Content-Type override (fetch handles it automatically)
service.request = function (config) {
    const options = { method: config.method || 'GET', ...config };
    if (config.data) options.body = config.data;
    if (config.params) options.query = config.params;

    // Remove Content-Type if body is FormData, so browser sets the boundary correctly
    if (options.body instanceof FormData && options.headers && options.headers['Content-Type']) {
        delete options.headers['Content-Type'];
    }

    return fetchInstance(config.url, options);
};

// 带重试的请求函数
export const requestWithRetry = async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;

            console.warn(`Request failed, retrying (${i + 1}/${maxRetries})...`);
            await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
};

export default service;
