<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'

const store = useTacticalStore()
const { personnel } = storeToRefs(store)

const displayPersonnel = computed(() => {
  if (personnel.value && personnel.value.length > 0) return personnel.value
  return [
    { id: 'FF-01', hr: 112, spO2: 98, status: 'normal', isMayday: false, floor: '2F' },
    { id: 'FF-02', hr: 145, spO2: 89, status: 'alert',  isMayday: false, floor: '2F' },
    { id: 'FF-03', hr: 98,  spO2: 99, status: 'normal', isMayday: false, floor: '3F' },
    { id: 'FF-04', hr: 105, spO2: 97, status: 'normal', isMayday: false, floor: 'B1' },
  ]
})

const sortedPersonnel = computed(() => {
  return [...displayPersonnel.value].sort((a, b) => {
    if (a.isMayday !== b.isMayday) return a.isMayday ? -1 : 1
    const aAbnormal = a.hr > 140 || a.spO2 < 95
    const bAbnormal = b.hr > 140 || b.spO2 < 95
    if (aAbnormal !== bAbnormal) return aAbnormal ? -1 : 1
    return 0
  })
})

const rowClass = (p) => {
  if (p.isMayday) return 'row-sos'
  if (p.hr > 140 || p.spO2 < 95) return 'row-alert'
  return ''
}

const hrColor = (p) => {
  if (p.isMayday) return 'var(--color-accent-sos)'
  return p.hr > 140 ? 'var(--color-accent-warning)' : 'var(--color-text-primary)'
}

const spColor = (p) => {
  if (p.isMayday) return 'var(--color-accent-sos)'
  return p.spO2 < 95 ? 'var(--color-accent-warning)' : 'var(--color-text-primary)'
}

const statusColor = (p) => {
  if (p.isMayday) return 'var(--color-accent-sos)'
  if (p.hr > 140 || p.spO2 < 95) return 'var(--color-accent-warning)'
  return 'var(--color-accent-safe)'
}
</script>

<template>
  <div class="personnel-panel hud-panel">
    <div class="panel-header">
      <div class="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span class="panel-title">人员安全生命体征摘要</span>
      </div>
      <span class="count-badge mono-small">[{{ sortedPersonnel.length }}]</span>
    </div>

    <!-- 列头 -->
    <div class="table-head">
      <span class="col-id">ID</span>
      <span class="col-hr">心率</span>
      <span class="col-sp">SPO2</span>
      <span class="col-st">状态</span>
    </div>

    <!-- 数据行 -->
    <div class="personnel-list">
      <div
        v-for="p in sortedPersonnel"
        :key="p.id"
        class="person-row"
        :class="rowClass(p)"
      >
        <span class="col-id mono-small person-id">{{ p.id }}</span>
        <span class="col-hr mono-normal" :style="{ color: hrColor(p) }">{{ p.hr || '--' }}</span>
        <span class="col-sp mono-normal" :style="{ color: spColor(p) }">{{ p.spO2 || '--' }}</span>
        <span class="col-st">
          <span class="status-dot" :style="{ backgroundColor: statusColor(p) }"></span>
        </span>
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent-sos);
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-text-primary);
}

.count-badge {
  color: var(--color-text-muted);
  font-size: 11px;
}

/* 表格列头 */
.table-head {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 40px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
}

.table-head span {
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: 0.05em;
}

/* 数据区 */
.personnel-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.personnel-list::-webkit-scrollbar { display: none; }

.person-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 40px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  align-items: center;
  transition: background 0.15s;
}
.person-row:last-child { border-bottom: none; }
.person-row:hover { background: rgba(255, 255, 255, 0.03); }

.person-row.row-sos {
  background: rgba(255, 60, 0, 0.08);
}
.person-row.row-alert {
  background: rgba(245, 158, 11, 0.06);
}

/* 列通用 */
.col-id, .col-hr, .col-sp, .col-st { }

.person-id {
  font-size: 11px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.col-hr, .col-sp {
  font-size: 13px;
  font-weight: 600;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
}
</style>
