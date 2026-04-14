<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'

const store = useTacticalStore()
const { isConnected, alerts, activePage } = storeToRefs(store)



// 任务计时器
const elapsed = ref(0)
let timer = null
onMounted(() => {
  timer = setInterval(() => elapsed.value++, 1000)
})
onUnmounted(() => clearInterval(timer))

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const totalAlerts = computed(() => (alerts?.value || []).length || 2)

</script>

<template>
  <header class="top-command-bar">
    <!-- 左侧: 系统标识 + 任务名 -->
    <div class="bar-section bar-left">
      <div class="logo-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
        <span class="sys-logo">火眼搜援</span>
      </div>
      <div class="divider-v"></div>
      <span class="mission-name">任务 · 3号楼内攻搜救</span>
    </div>

    <div class="bar-center"></div>

    <!-- 右侧: 关键状态指标 + 告警计数 + 时间 -->
    <div class="bar-section bar-right">
      <div class="stat-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span class="stat-label">任务时长</span>
      </div>
      <div class="divider-v"></div>
      <div class="stat-item">
        <span class="percent-icon">%</span>
        <span class="stat-label">已搜覆盖</span>
      </div>
      <div class="divider-v"></div>
      <div class="stat-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="M8 17l4 4 4-4"></path></svg>
        <span class="stat-label">MESH·在线</span>
      </div>
      <button class="action-btn">现场行动</button>
    </div>
  </header>
</template>


<style scoped>
.top-command-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  background-color: var(--color-void);
  border-bottom: 1px solid rgba(255, 60, 0, 0.15); /* Ghost Border */
  position: absolute;
  top: 0;
  left: 0; /* 占据整个顶栏，不再避开 SideNav */
  width: 100vw;
  z-index: 60; /* 高级层，压住下方所有元素 */
  pointer-events: auto;
}

.bar-section {
  display: flex;
  align-items: center;
  height: 100%;
}

.bar-left {
  padding-left: 24px;
  gap: 16px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-accent-sos);
}

.sys-logo {
  font-family: var(--font-sans); /* "Editorial" font */
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 2px;
}

.divider-v {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
}

.mission-name {
  color: var(--color-accent-safe);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 14px;
}

.bar-center {
  flex: 1;
}

.bar-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  padding: 0 24px;
}

.percent-icon {
  font-family: var(--font-sans);
  font-weight: bold;
  font-size: 18px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.action-btn {
  height: 100%;
  padding: 0 32px;
  background: transparent;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-weight: bold;
  border: none;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.action-btn::before {
  content: "■";
  color: var(--color-accent-sos);
  font-size: 10px;
}
</style>
