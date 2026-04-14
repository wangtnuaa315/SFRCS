<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'

const store = useTacticalStore()
const { isConnected, alerts, activePage } = storeToRefs(store)

// 导航标签页
const navTabs = [
  { label: '态势', page: 'overview' },
  { label: 'AI感知', page: 'ai' },
  { label: '热力搜救', page: 'overview' },
  { label: '人员安全', page: 'overview' },
  { label: '链路', page: 'overview' },
]

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

const isActiveTab = (tab) => {
  if (tab.page === 'ai') return activePage.value === 'ai'
  return activePage.value === 'overview' && tab.label === '态势'
}

const handleTabClick = (tab) => {
  store.setActivePage(tab.page)
}
</script>

<template>
  <header class="top-command-bar">
    <!-- 左侧: 系统标识 + 任务名 -->
    <div class="bar-section bar-left">
      <span class="sys-logo mono-small">火眼搜援</span>
      <div class="divider-v"></div>
      <span class="mission-name sans-body">任务 · 3号楼内攻搜救</span>
    </div>

    <!-- 中央: 导航标签页 -->
    <div class="bar-center">
      <nav class="nav-pill hud-panel-pill">
        <button
          v-for="tab in navTabs"
          :key="tab.label"
          class="nav-tab mono-small"
          :class="{ active: isActiveTab(tab) }"
          @click="handleTabClick(tab)"
        >{{ tab.label }}</button>
      </nav>
    </div>

    <!-- 右侧: 关键状态指标 + 告警计数 + 时间 -->
    <div class="bar-section bar-right">
      <div class="stat-item">
        <span class="stat-label mono-small">任务时长</span>
        <span class="stat-value mono-normal">{{ formatTime(elapsed) }}</span>
      </div>
      <div class="divider-v"></div>
      <div class="stat-item">
        <span class="stat-label mono-small">已搜覆盖</span>
        <span class="stat-value mono-normal" style="color: var(--color-accent-safe)">47%</span>
      </div>
      <div class="divider-v"></div>
      <div class="stat-item">
        <span class="stat-label mono-small">主链路</span>
        <span class="stat-value mono-small link-ok" v-if="isConnected">
          <span class="link-dot">●</span> MESH·在线
        </span>
        <span class="stat-value mono-small link-fail" v-else>
          <span class="link-dot-fail">●</span> 链路断开
        </span>
      </div>
      <div class="divider-v"></div>
      <div class="stat-item">
        <span class="stat-label mono-small">副链路</span>
        <span class="stat-value mono-small" style="color: var(--color-text-muted)">SAT·待机</span>
      </div>
      <div class="divider-v"></div>
      <div class="alert-counter" :class="{ 'has-alert': totalAlerts > 0 }">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
          <path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
        <span class="mono-small">告警 <span class="alert-num">{{ totalAlerts }}</span></span>
      </div>
      <div class="divider-v"></div>
      <span class="mono-small" style="color: var(--color-text-muted); white-space: nowrap;">
        {{ new Date().toLocaleTimeString('zh-CN', { hour12: false }) }}
      </span>
    </div>
  </header>
</template>


<style scoped>
.top-command-bar {
  height: 56px;
  background-color: rgba(3, 5, 9, 0.96);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 0;
  flex-shrink: 0;
  z-index: 20;
  position: relative;
}

.nav-pill {
  display: flex;
  gap: 0;
  align-items: center;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  background-color: rgba(10, 13, 20, 0.82);
}

.nav-tab {
  padding: 10px 14px 8px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-tab:hover {
  color: var(--color-text-primary);
}
.nav-tab.active {
  color: var(--color-accent-sos);
  border-bottom-color: var(--color-accent-sos);
}

.bar-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-left {
  flex: 0 0 auto;
  white-space: nowrap;
}

/* nav-tabs.bar-center: 导航占据中央弹性空间 */
.bar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.bar-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.sys-logo {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent-sos);
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.divider-v {
  width: 1px;
  height: 20px;
  background-color: var(--color-border);
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  white-space: nowrap;
}

.stat-label {
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 13px;
  color: var(--color-text-primary);
  line-height: 1;
}

.link-ok { color: var(--color-accent-safe) !important; }
.link-fail { color: var(--color-accent-sos) !important; }

.link-dot {
  font-size: 8px;
  animation: blink 2s infinite;
}
.link-dot-fail {
  font-size: 8px;
  color: var(--color-accent-sos);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.alert-counter {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  padding: 3px 8px;
  border-radius: 3px;
}

.alert-counter.has-alert {
  color: var(--color-accent-sos);
  background-color: rgba(255, 60, 0, 0.1);
  border: 1px solid rgba(255, 60, 0, 0.3);
}

.alert-num {
  color: var(--color-accent-sos);
  font-weight: bold;
}

@media (max-width: 1500px) {
  .top-command-bar {
    padding: 0 12px;
  }

  .bar-left {
    gap: 8px;
  }

  .bar-right {
    gap: 8px;
  }

  .nav-pill {
    padding: 0 10px;
  }

  .nav-tab {
    padding: 10px 10px 8px;
  }
}
</style>
