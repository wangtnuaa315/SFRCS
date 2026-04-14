<script setup>
import { ref } from 'vue'

const alerts = ref([
  { id: 'ALT001', level: 'P0', tag: 'SIT·P0', title: 'SOS 触发 // FF-02', desc: '人员倒地监测：SECTOR DELTA-4. 请求立即撤离/搜索。', time: '14:23', read: false },
  { id: 'ALT002', level: 'P1', tag: 'SCAN·P1', title: 'AI 检测：疑似目标', desc: '在北翼检测到潜在的结构失效特征信号。', time: '14:20', read: false },
])
</script>

<template>
  <div class="alert-list-panel hud-panel">
    <!-- 标题栏：橙红实心背景 -->
    <div class="panel-header">
      <span class="panel-title">实时告警列表</span>
      <span class="count-badge">{{ alerts.length }}</span>
    </div>

    <!-- 告警列表 -->
    <div class="alert-items">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-item"
        :class="'level-' + alert.level.toLowerCase()"
      >
        <div class="alert-top-row">
          <span class="alert-title">{{ alert.title }}</span>
          <span class="alert-tag mono-small" :class="'tag-' + alert.level.toLowerCase()">{{ alert.tag }}</span>
        </div>
        <div class="alert-desc-row">
          {{ alert.desc }}
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

/* 标题栏：实心橙红背景 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background-color: var(--color-accent-sos);
  flex-shrink: 0;
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
}

.count-badge {
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: bold;
  padding: 1px 6px;
  min-width: 20px;
  text-align: center;
}

/* 条目区 */
.alert-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.alert-items::-webkit-scrollbar { display: none; }

.alert-item {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
}
.alert-item:last-child { border-bottom: none; }

/* P0 呼吸动效 */
.alert-item.level-p0 {
  background: rgba(255, 60, 0, 0.08);
  animation: p0-breathe 2s ease-in-out infinite;
}
@keyframes p0-breathe {
  0%,100% { background: rgba(255, 60, 0, 0.06); }
  50%      { background: rgba(255, 60, 0, 0.16); }
}

.alert-item.level-p1 {
  background: rgba(245, 158, 11, 0.05);
}

/* 标题行 */
.alert-top-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}

.alert-title {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.alert-tag {
  font-size: 9px;
  font-weight: bold;
  flex-shrink: 0;
  margin-left: 8px;
}
.tag-p0 { color: var(--color-accent-sos); }
.tag-p1 { color: var(--color-accent-warning); }
.tag-p2 { color: var(--color-text-muted); }

/* 描述行 */
.alert-desc-row {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1.4;
}
</style>
