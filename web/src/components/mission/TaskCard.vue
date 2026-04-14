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
  <div class="task-row" :class="'type-' + typeClass.toLowerCase()">
    <div class="task-main">
      <span class="task-name">{{ taskTitle }}</span>
      <span class="task-status mono-small" :class="'st-' + typeClass.toLowerCase()">{{ taskType }}</span>
    </div>
    <div class="task-progress-wrap" v-if="progress > 0">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="progress-pct mono-small">{{ progress }}%</span>
    </div>
  </div>
</template>

<style scoped>
.task-row {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 0.15s;
}
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: rgba(255, 255, 255, 0.03); }

.task-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.task-name {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.task-status {
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
}
.st-active   { color: var(--color-accent-safe); }
.st-analyzing{ color: var(--color-accent-ai); }
.st-queued   { color: var(--color-text-muted); }
.st-done     { color: var(--color-accent-sos); }

/* 进度条 */
.task-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-track {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent-safe);
  transition: width 0.4s;
}
.type-analyzing .progress-fill { background: var(--color-accent-ai); }
.type-done .progress-fill { background: var(--color-accent-sos); }

.progress-pct {
  font-size: 10px;
  color: var(--color-accent-safe);
  flex-shrink: 0;
}
.type-analyzing .progress-pct { color: var(--color-accent-ai); }
</style>
