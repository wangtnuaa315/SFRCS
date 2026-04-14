<script setup>
defineProps({
  taskTitle: { type: String, required: true },
  taskType: { type: String, default: '执行中' },
  typeClass: { type: String, default: 'ACTIVE' },
  progress: { type: Number, default: 0 },
  statusDesc: { type: String, default: '正在执行' }
})
</script>

<template>
  <div class="hud-panel task-card" :class="'type-' + typeClass.toLowerCase()">
    <div class="task-header">
      <span class="sans-title">{{ taskTitle }}</span>
      <span class="mono-small status-label">{{ taskType }}</span>
    </div>
    
    <div class="task-body">
      <!-- 借用一个简单的图标位 -->
      <div class="task-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
      </div>
      <div class="task-info">
        <div class="desc mono-small">状态: {{ statusDesc }}</div>
        <div class="progress-wrapper" v-if="progress > 0">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="mono-small">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  padding: 12px;
  border-left: 2px solid var(--color-border);
  transition: all 0.2s;
}

/* 根据状态改变左侧边框颜色 */
.type-active { border-left-color: var(--color-accent-safe); }
.type-analyzing { border-left-color: var(--color-accent-ai); }
.type-queued { border-left-color: var(--color-text-muted); } /* 修复：--color-muted 未定义，改用 --color-text-muted */
.type-done { border-left-color: var(--color-accent-sos); }

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.status-label {
  color: inherit;
}
.type-active .status-label { color: var(--color-accent-safe); }
.type-analyzing .status-label { color: var(--color-accent-ai); }
.type-done .status-label { color: var(--color-accent-sos); }

.task-body {
  display: flex;
  gap: 12px;
  align-items: center;
}

.task-icon {
  width: 32px;
  height: 32px;
  background-color: rgba(255,255,255,0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
.type-active .task-icon { color: var(--color-accent-safe); }
.type-done .task-icon { color: var(--color-accent-sos); }

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.desc {
  color: var(--color-text-muted);
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 1px; /* 规范要求: 1px 线槽 */
  background-color: var(--color-border);
  position: relative;
}

.progress-fill {
  position: absolute;
  top: -0.5px; /* 视觉居中 */
  left: 0;
  height: 2px; /* 规范要求: 2px 进度线 */
  background-color: var(--color-accent-safe);
}

.type-done .progress-fill {
  background-color: var(--color-accent-sos);
}
</style>
