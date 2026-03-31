<template>
    <div class="main-layout">
        <!-- Dynamic Background -->
        <div class="system-bg">
            <div class="bg-glow-orb orb-1"></div>
            <div class="bg-glow-orb orb-2"></div>
            <div class="bg-minimal-mesh"></div>
        </div>

        <!-- Render header conditionally based on route or meta -->
        <header v-show="!route.meta.hideHeader" class="app-header system-nav">
            <div class="header-left">
                <div class="brand" @click="goHome">
                    <div class="brand-icon">
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span class="brand-text">GraphRAG</span>
                    <span class="badge-system">Core v1.0</span>
                </div>
            </div>

            <div class="header-center" id="header-center">
                <slot name="header-center" />
            </div>

            <div class="header-right" id="header-right">
                <slot name="header-right" />
                <a
                    href="https://github.com/easylife2567/GarphRAG-Agent-Prediction"
                    target="_blank"
                    class="btn-secondary"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                        ></path>
                    </svg>
                    <span>GitHub</span>
                </a>
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
    background: transparent;
    position: relative;
    overflow-x: hidden;
}

/* Dynamic Background */
.system-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: var(--bg-base);
    overflow: hidden;
}

.bg-glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.15;
    animation: drift 20s ease-in-out infinite alternate;
}

.orb-1 {
    width: 60vw;
    height: 60vh;
    background: #3b82f6; /* Blueish */
    top: -10vh;
    left: -10vw;
}

.orb-2 {
    width: 50vw;
    height: 50vh;
    background: #8b5cf6; /* Purpleish */
    bottom: -10vh;
    right: -10vw;
    animation-delay: -10s;
}

@keyframes drift {
    0% {
        transform: translate(0, 0) scale(1);
    }
    100% {
        transform: translate(10vw, 5vh) scale(1.1);
    }
}

.bg-minimal-mesh {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

/* Header */
.app-header.system-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 64px;
    border-bottom: 1px solid var(--border-dim);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    flex-shrink: 0;
}

.header-left {
    display: flex;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
}

.brand-text {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.badge-system {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    padding: 2px 6px;
    background: var(--border-dim);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-bright);
}

.header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    z-index: 10;
}
</style>
