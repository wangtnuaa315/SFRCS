<script setup>
import { computed } from 'vue'

const sensors = [
  { id: 'temp', label: 'TEMP_CORE', value: '42.0', unit: '°C', status: 'danger', percent: 85 },
  { id: 'co', label: 'CO_LVL', value: '180', unit: 'PPM', status: 'warning', percent: 60 },
  { id: 'o2', label: 'O2_SAT', value: '19.5', unit: '%', status: 'normal', percent: 45 },
  { id: 'rad', label: 'RAD_ENV', value: '0.12', unit: 'uSv', status: 'normal', percent: 15 }
]

const getStatusColor = (status) => {
  if (status === 'danger') return 'var(--color-accent-sos)'
  if (status === 'warning') return 'var(--color-accent-warning)'
  return 'var(--color-accent-safe)'
}

const segmentCount = 12;
</script>

<template>
  <div class="sensor-matrix hud-panel">
    <div class="panel-header">
      <span class="panel-title">现场环境阵列</span>
      <span class="mono-small status-indicator">LIVE <span class="blink-dot">●</span></span>
    </div>
    
    <div class="matrix-list">
      <div 
        v-for="s in sensors" 
        :key="s.id" 
        class="sensor-row"
      >
        <div class="sensor-info">
          <span class="s-label mono-small">{{ s.label }}</span>
          <span class="s-value mono-normal" :style="{ color: getStatusColor(s.status) }">
            {{ s.value }}<span class="s-unit">{{ s.unit }}</span>
          </span>
        </div>
        <div class="sensor-bar">
          <div 
            v-for="i in segmentCount" 
            :key="i"
            class="bar-segment"
            :class="{ active: (i / segmentCount) * 100 <= s.percent }"
            :style="{ backgroundColor: (i / segmentCount) * 100 <= s.percent ? getStatusColor(s.status) : '' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sensor-matrix {
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  background-color: var(--color-surface); /* 编辑式粗野主义的实心背景 */
  border: 1px solid rgba(255, 60, 0, 0.15); /* Ghost Border */
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.04em;
}

.status-indicator {
  color: var(--color-accent-safe);
  display: flex;
  align-items: center;
  gap: 4px;
}

.blink-dot {
  font-size: 10px;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.matrix-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  flex: 1;
}

.sensor-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sensor-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.s-label {
  color: var(--color-text-muted);
  font-size: 10px;
  letter-spacing: 0.05em;
}

.s-value {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
}

.s-unit {
  font-size: 9px;
  color: rgba(255,255,255,0.4);
  margin-left: 2px;
}

.sensor-bar {
  display: flex;
  gap: 2px;
  height: 6px;
}

.bar-segment {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05); /* 空白段颜色 */
  transition: background-color 0.3s;
}
</style>
