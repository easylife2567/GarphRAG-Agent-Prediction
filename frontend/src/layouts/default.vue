<template>
    <div class="main-layout">
        <!-- Render header conditionally based on route or meta -->
        <!-- Use v-show instead of v-if to prevent Teleport parentNode null errors during route transitions -->
        <header v-show="!route.meta.hideHeader" class="app-header">
            <div class="header-left">
                <div class="brand" @click="goHome">GarphRAG-Agent-Prediction</div>
            </div>

            <div class="header-center" id="header-center">
                <!-- Center content can be injected by pages if needed -->
                <slot name="header-center" />
            </div>

            <div class="header-right" id="header-right">
                <!-- Right content can be injected by pages if needed -->
                <slot name="header-right" />
            </div>
        </header>

        <main class="content-area">
            <slot />
        </main>
        <div id="teleport-target"></div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from '#app';

const router = useRouter();
const route = useRoute();

const goHome = () => {
    router.push('/');
};
</script>

<style scoped>
.main-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    font-family: 'Space Grotesk', 'Noto Sans SC', system-ui, sans-serif;
}

/* Header */
.app-header {
    height: 60px;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: #fff;
    z-index: 100;
    position: sticky;
    top: 0;
    flex-shrink: 0;
}

.header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.brand {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 1px;
    cursor: pointer;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Content */
.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    /* Remove overflow: hidden to allow natural scrolling for pages that need it */
}
</style>
