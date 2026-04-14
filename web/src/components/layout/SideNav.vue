<template>
  <nav class="side-nav">
    <div class="nav-top">
      <button class="nav-item" :class="{ active: activePage === 'overview' }" @click="setActive('overview')" title="综合态势">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span class="nav-label">态势</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'ai' }" @click="setActive('ai')" title="AI感知">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        <span class="nav-label">AI感知</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'heatmap' }" @click="setActive('heatmap')" title="热力图">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
        <span class="nav-label">热力图</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'personnel' }" @click="setActive('personnel')" title="人员安全">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span class="nav-label">人员安全</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'tasks' }" @click="setActive('tasks')" title="任务管理">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span class="nav-label">任务管理</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'communication' }" @click="setActive('communication')" title="链路状态">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8"></rect><rect x="2" y="14" width="20" height="8"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
        <span class="nav-label">链路状态</span>
      </button>
      <button class="nav-item" :class="{ active: activePage === 'replay' }" @click="setActive('replay')" title="任务复盘">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span class="nav-label">任务复盘</span>
      </button>
    </div>
    <div class="nav-bottom">
      <button class="nav-sos" @click="handleSos">
        <span class="sos-text">SOS</span>
        <span class="sos-text-cn">紧急</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'

const store = useTacticalStore()
const { activePage } = storeToRefs(store)

const setActive = (page) => {
  store.setActivePage(page)
}

const handleSos = () => {
  console.log('SOS COMMAND INITIATED')
}
</script>

<style scoped>
.side-nav {
  width: 72px;
  height: calc(100vh - 56px);
  background-color: var(--color-void);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  z-index: 50;
  position: absolute;
  top: 56px;
  left: 0;
  pointer-events: auto;
}

.nav-top {
  flex: 1; /* 撑满剩余空间，把 SOS 挤到底部 */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 8px;
}

.nav-item {
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  color: var(--color-text-muted);
  width: 100%;
  aspect-ratio: 1; /* Make it square */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-accent-sos);
}

.nav-item.active {
  border-left: 4px solid var(--color-accent-sos);
  background-color: rgba(255, 60, 0, 0.05); /* Slight tint */
}

.nav-label {
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 72px; /* 固定高度容器 */
  width: 100%;
}

.nav-sos {
  background-color: var(--color-accent-sos);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}

.sos-text {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 16px;
  line-height: 1;
  margin-bottom: 2px;
}

.sos-text-cn {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
