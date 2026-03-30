import { onUnmounted } from 'vue';

export function useTaskPolling() {
    const timers = new Map<string, ReturnType<typeof setInterval>>();

    const startPolling = (
        key: string,
        pollingFn: () => Promise<void> | void,
        intervalMs: number = 2000
    ) => {
        if (!key || typeof pollingFn !== 'function') {
            console.error(`[useTaskPolling] Invalid arguments for startPolling. key: ${key}, pollingFn: ${typeof pollingFn}`);
            return;
        }

        if (timers.has(key)) {
            stopPolling(key);
        }
        
        // Execute immediately
        pollingFn();
        
        const timer = setInterval(pollingFn, intervalMs);
        timers.set(key, timer);
    };

    const stopPolling = (key: string) => {
        const timer = timers.get(key);
        if (timer) {
            clearInterval(timer);
            timers.delete(key);
        }
    };

    const stopAllPolling = () => {
        timers.forEach((timer) => clearInterval(timer));
        timers.clear();
    };

    onUnmounted(() => {
        stopAllPolling();
    });

    return {
        startPolling,
        stopPolling,
        stopAllPolling,
    };
}
