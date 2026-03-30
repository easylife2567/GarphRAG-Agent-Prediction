<template>
    <div class="mock-health-panel" :class="{ open: expanded }">
        <div class="panel-header" @click="expanded = !expanded">
            <span class="title">MOCK HEALTH</span>
            <span class="status" :class="overallClass">{{ overallText }}</span>
        </div>
        <div v-if="expanded" class="panel-body">
            <div class="meta-row">
                <span>更新时间</span>
                <span>{{ updatedAt || '--' }}</span>
            </div>
            <div class="meta-row">
                <span>检查项</span>
                <span>{{ totalChecks }}</span>
            </div>
            <div class="meta-row">
                <span>通过</span>
                <span>{{ passedChecks }}</span>
            </div>
            <div class="check-list">
                <div v-for="item in checks" :key="item.key" class="check-item">
                    <span class="dot" :class="{ ok: item.ok, fail: !item.ok }"></span>
                    <span class="name">{{ item.name }}</span>
                </div>
            </div>
            <button class="refresh-btn" @click.stop="fetchHealth" :disabled="loading">
                {{ loading ? '检查中...' : '重新检查' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false);
const expanded = ref(false);
const updatedAt = ref('');
const checks = ref([]);

const passedChecks = computed(() => checks.value.filter((i) => i.ok).length);
const totalChecks = computed(() => checks.value.length);
const isHealthy = computed(() => totalChecks.value > 0 && passedChecks.value === totalChecks.value);
const overallText = computed(() => (isHealthy.value ? 'HEALTHY' : 'UNHEALTHY'));
const overallClass = computed(() => (isHealthy.value ? 'ok' : 'fail'));

const fetchHealth = async () => {
    loading.value = true;
    try {
        const res = await $fetch('/api/mock/health', { query: { t: Date.now() } });
        if (res?.success && res?.data) {
            checks.value = res.data.checks || [];
            updatedAt.value = res.data.updated_at || '';
        }
    } catch (error) {
        checks.value = [{ key: 'health-api', name: '健康接口可访问', ok: false }];
        updatedAt.value = new Date().toISOString();
    } finally {
        loading.value = false;
    }
};

onMounted(fetchHealth);
</script>

<style scoped>
.mock-health-panel {
    position: fixed;
    right: 16px;
    bottom: 16px;
    width: 240px;
    background: rgba(10, 10, 10, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    color: #fff;
    z-index: 1200;
    font-family: 'JetBrains Mono', monospace;
    backdrop-filter: blur(8px);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    cursor: pointer;
}

.title {
    font-size: 11px;
    letter-spacing: 0.5px;
}

.status {
    font-size: 11px;
    font-weight: 700;
}

.status.ok {
    color: #72e39a;
}

.status.fail {
    color: #ff7a7a;
}

.panel-body {
    padding: 0 12px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.75);
}

.check-list {
    margin-top: 8px;
    max-height: 180px;
    overflow-y: auto;
}

.check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    margin: 6px 0;
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.dot.ok {
    background: #72e39a;
}

.dot.fail {
    background: #ff7a7a;
}

.name {
    color: rgba(255, 255, 255, 0.9);
}

.refresh-btn {
    margin-top: 10px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    height: 30px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
