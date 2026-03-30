import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTaskPolling } from '../src/composables/useTaskPolling';
import * as vue from 'vue';

// Mock vue onUnmounted
vi.mock('vue', () => ({
    onUnmounted: vi.fn(),
}));

describe('useTaskPolling', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should start and stop polling correctly', () => {
        const { startPolling, stopPolling } = useTaskPolling();
        const pollingFn = vi.fn();

        startPolling('testTask', pollingFn, 1000);

        // Should be called immediately once
        expect(pollingFn).toHaveBeenCalledTimes(1);

        // Advance time by 1000ms
        vi.advanceTimersByTime(1000);
        expect(pollingFn).toHaveBeenCalledTimes(2);

        // Advance time by another 1000ms
        vi.advanceTimersByTime(1000);
        expect(pollingFn).toHaveBeenCalledTimes(3);

        // Stop polling
        stopPolling('testTask');
        
        // Advance time by 1000ms
        vi.advanceTimersByTime(1000);
        
        // Should not be called again
        expect(pollingFn).toHaveBeenCalledTimes(3);
    });

    it('should handle missing arguments gracefully (preventing crash)', () => {
        const { startPolling } = useTaskPolling();
        
        // @ts-ignore - intentional bad call
        startPolling();
        
        // Expect console.error to have been called because of invalid arguments
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('[useTaskPolling] Invalid arguments for startPolling')
        );
    });

    it('should clear all polling tasks on stopAllPolling', () => {
        const { startPolling, stopAllPolling } = useTaskPolling();
        const pollingFn1 = vi.fn();
        const pollingFn2 = vi.fn();

        startPolling('task1', pollingFn1, 1000);
        startPolling('task2', pollingFn2, 2000);

        expect(pollingFn1).toHaveBeenCalledTimes(1);
        expect(pollingFn2).toHaveBeenCalledTimes(1);

        stopAllPolling();

        vi.advanceTimersByTime(2000);

        // Timers should be stopped, so no additional calls
        expect(pollingFn1).toHaveBeenCalledTimes(1);
        expect(pollingFn2).toHaveBeenCalledTimes(1);
    });
});
