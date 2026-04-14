<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'

const store = useTacticalStore()
const { personnel } = storeToRefs(store)

// Mock数据兜底
const displayPersonnel = computed(() => {
  if (personnel.value && personnel.value.length > 0) return personnel.value
  return [
    { id: 'FF-01', hr: 112, spO2: 98, status: 'normal', isMayday: false, floor: '2F' },
    { id: 'FF-02', hr: 158, spO2: 96, status: 'alert', isMayday: false, floor: '2F' },
    { id: 'FF-03', hr: 105, spO2: 99, status: 'normal', isMayday: false, floor: '3F' },
    { id: 'FF-04', hr: 0,   spO2: 0,  status: 'sos',    isMayday: true,  floor: 'B1' },
  ]
})

// 异常置顶排序
const sortedPersonnel = computed(() => {
  return [...displayPersonnel.value].sort((a, b) => {
    if (a.isMayday !== b.isMayday) return a.isMayday ? -1 : 1
    const aAbnormal = a.hr > 140 || a.spO2 < 95
    const bAbnormal = b.hr > 140 || b.spO2 < 95
    if (aAbnormal !== bAbnormal) return aAbnormal ? -1 : 1
    return 0
  })
})

const getStatusColor = (p) => {
  if (p.isMayday) return 'var(--color-accent-sos)'
  if (p.hr > 140 || p.spO2 < 95) return 'var(--color-accent-warning)'
  return 'var(--color-accent-safe)'
}

const getStatusLabel = (p) => {
  if (p.isMayday) return 'SOS'
  if (p.hr > 140) return '心率偏高'
  if (p.spO2 < 95) return '血氧偏低'
  return '正常'
}

const hrColor = (hr, p) => {
  if (p.isMayday) return 'var(--color-accent-sos)'
  return hr > 140 ? 'var(--color-accent-warning)' : 'var(--color-accent-safe)'
}
</script>

<template>
  <div class="personnel-panel hud-panel">
    <div class="panel-header">
        <div class="header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span class="panel-title">人员状态</span>
      </div>
      <span class="mono-small">{{ sortedPersonnel.length }} 人在场</span>
    </div>

    <div class="personnel-list">
      <div
        v-for="p in sortedPersonnel"
        :key="p.id"
        class="person-card"
        :class="{ 'is-sos': p.isMayday }"
      >
        <div class="person-status-bar" :style="{ backgroundColor: getStatusColor(p) }"></div>
        <div class="person-info">
          <div class="person-id-row">
            <span class="mono-small person-id">{{ p.id }}</span>
            <span v-if="p.floor" class="person-floor mono-small">{{ p.floor }}</span>
            <span class="status-chip mono-small" :style="{ color: getStatusColor(p) }">{{ getStatusLabel(p) }}</span>
          </div>
          <div class="vitals-row">
            <div class="vital">
              <span class="mono-normal" :style="{ color: hrColor(p.hr, p) }">{{ p.hr || '--' }}</span>
              <span class="unit-text">BPM</span>
            </div>
            <div class="vital-divider"></div>
            <div class="vital">
              <span class="mono-normal" style="color: var(--color-text-primary)">{{ p.spO2 || '--' }}</span>
              <span class="unit-text">SpO₂%</span>
            </div>
          </div>
        </div>
        <!-- SOS特殊动效 -->
        <div v-if="p.isMayday" class="sos-pulse-ring"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personnel-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-height: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
}

.header-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent-sos);
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-accent-sos);
}

.personnel-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.personnel-list::-webkit-scrollbar { display: none; }

.person-card {
  display: flex;
  gap: 8px;
  padding: 7px 10px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.person-card.is-sos {
  border-color: var(--color-accent-sos);
  background-color: rgba(255, 60, 0, 0.05);
  animation: sos-flash 1.5s ease-in-out infinite;
}

@keyframes sos-flash {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 12px rgba(255, 60, 0, 0.3); }
}

.person-status-bar {
  width: 3px;
  flex-shrink: 0;
  border-radius: 2px;
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-id-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.person-id {
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: bold;
  min-width: 0;
}

.person-floor {
  font-size: 10px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.status-chip {
  font-size: 10px;
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

.vitals-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.vital {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.vital .mono-normal {
  font-size: 14px;
  line-height: 1;
}

.vital-divider {
  width: 1px;
  height: 14px;
  background-color: var(--color-border);
}

.sos-pulse-ring {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-accent-sos);
  animation: pulse-ring 1s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: translateY(-50%) scale(1); opacity: 1; }
  100% { transform: translateY(-50%) scale(2.5); opacity: 0; }
}

@media (max-width: 1500px) {
  .person-card {
    padding: 7px 8px;
  }

  .person-id-row {
    gap: 6px;
  }
}
</style>
