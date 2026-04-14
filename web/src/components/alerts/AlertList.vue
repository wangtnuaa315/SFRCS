<script setup>
import { ref } from 'vue'

// 模拟告警数据
const alerts = ref([
  { id: 'ALT001', level: 'P0', title: 'FF-02 心率异常', desc: '心率 ≥ 155 BPM 超过3分钟', time: '14:23', read: false },
  { id: 'ALT002', level: 'P0', title: 'SOS 触发', desc: 'FF-04 长按侧键触发求救', time: '14:18', read: false },
  { id: 'ALT003', level: 'P1', title: 'AI 疑似目标', desc: '2层东北区域 - 置信度78%', time: '14:15', read: false },
  { id: 'ALT004', level: 'P1', title: '链路信号衰减', desc: 'FF-04 进入弱覆盖区域', time: '14:12', read: true },
  { id: 'ALT005', level: 'P2', title: '任务超时提醒', desc: 'B栋渗透任务已超预计时间', time: '14:05', read: true },
])

const levelColor = (level) => {
  if (level === 'P0') return 'var(--color-accent-sos)'
  if (level === 'P1') return 'var(--color-accent-warning)'
  return 'var(--color-text-muted)'
}
</script>

<template>
  <div class="alert-list-panel hud-panel">
    <div class="panel-header">
      <div class="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <span class="panel-title">实时告警列表</span>
      </div>
      <div class="unread-badge">
        <span class="mono-small">{{ alerts.filter(a => !a.read).length }}</span>
      </div>
    </div>

    <div class="alert-items">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-item"
        :class="{ 'unread': !alert.read, [`level-${alert.level.toLowerCase()}`]: true }"
      >
        <div class="alert-dot" :style="{ backgroundColor: levelColor(alert.level) }"></div>
        <div class="alert-content">
          <div class="alert-title-row">
            <span class="sans-body" style="font-size:13px;">{{ alert.title }}</span>
            <span class="level-tag mono-small" :style="{ color: levelColor(alert.level) }">{{ alert.level }}</span>
          </div>
          <div class="alert-desc mono-small">{{ alert.desc }}</div>
          <div class="alert-time mono-small">{{ alert.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-list-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
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

.unread-badge {
  color: var(--color-accent-sos);
  font-size: 13px;
  font-family: var(--font-mono);
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

.alert-items {
  flex: 1;
  overflow-y: auto;
}
.alert-items::-webkit-scrollbar { display: none; }

.alert-item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.5);
  cursor: pointer;
  transition: background-color 0.15s;
}
.alert-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
.alert-item.unread {
  background-color: rgba(255, 255, 255, 0.02);
}
.alert-item.level-p0 { border-left: 2px solid var(--color-accent-sos); }
.alert-item.level-p1 { border-left: 2px solid var(--color-accent-warning); }
.alert-item.level-p2 { border-left: 2px solid var(--color-text-muted); }

.alert-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.level-tag {
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
}

.alert-desc {
  color: var(--color-text-muted);
  margin-top: 2px;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-time {
  color: rgba(100, 116, 139, 0.6);
  font-size: 10px;
  margin-top: 2px;
}
</style>
