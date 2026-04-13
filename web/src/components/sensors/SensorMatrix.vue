<script setup>
import { computed } from 'vue'

const props = defineProps({
  targetPersonnel: { type: Object, default: () => ({}) }
})

// 为简化直接提取第一个人的数据
const id = computed(() => props.targetPersonnel?.id || 'FF-03')
const hr = computed(() => props.targetPersonnel?.hr || '--')
const spO2 = computed(() => props.targetPersonnel?.spO2 || '--')
const temp = computed(() => props.targetPersonnel?.temp || '--')
const hrColor = computed(() => hr.value > 120 ? 'var(--color-accent-sos)' : 'var(--color-accent-safe)')
</script>

<template>
  <div class="hud-panel sensor-matrix">
    <div class="matrix-header mono-small">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity" style="color: var(--color-accent-safe)"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>
      智能矩阵 // 实况流
    </div>
    
    <div class="matrix-grid">
      <div class="sensor-cell">
        <div class="mono-small label" style="color: var(--color-accent-safe)">作战单元 // {{ id }}</div>
        <div class="value-row">
          <span class="mono-large">{{ spO2 }}%</span>
          <span class="unit-text">血氧</span>
        </div>
      </div>
      
      <div class="sensor-cell">
        <div class="mono-small label" style="color: var(--color-accent-safe)">心率 // BPM</div>
        <div class="value-row">
          <span class="mono-large" :style="{ color: hrColor }">{{ hr }}</span>
          <span class="unit-text">正常</span>
        </div>
      </div>
      
      <div class="sensor-cell">
        <div class="mono-small label" :style="{ color: hrColor }">体温 // TEMP</div>
        <div class="value-row">
          <span class="mono-large">{{ temp }}°C</span>
          <span class="unit-text">正常</span>
        </div>
      </div>
      
      <div class="sensor-cell">
        <div class="mono-small label" style="color: var(--color-accent-ai)">氧气 // LVL</div>
        <div class="value-row">
          <span class="mono-large">22.4%</span>
          <span class="unit-text">极危</span>
        </div>
      </div>
    </div>
    
    <div class="matrix-footer mono-small">
      数据传输: 正常 [12.4kbps]<br>
      身份认证: [V-2_已验证]
    </div>
  </div>
</template>

<style scoped>
.sensor-matrix {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.matrix-header {
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.sensor-cell {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.value-row {
  display: flex;
  align-items: baseline;
}

.matrix-footer {
  color: var(--color-text-muted);
  line-height: 1.4;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
}
</style>
