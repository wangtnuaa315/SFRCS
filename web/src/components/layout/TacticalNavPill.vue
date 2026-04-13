<script setup>
defineProps({
  time: { type: String, default: '14:23:45' },
  activeUnits: { type: Number, default: 12 }
})
</script>

<template>
  <div class="hud-panel-pill">
    <span class="mono-large" style="color: var(--color-accent-sos); margin-right: 24px; font-weight: 900; letter-spacing: 1px;">搜援指挥中心</span>
    
    <div class="nav-links">
      <span class="nav-link active">全局态势</span>
      <span class="nav-link">作战单元</span>
      <span class="nav-link">数据面板</span>
      <span class="nav-link">AI 感知</span>
    </div>

    <div class="nav-divider"></div>
    
    <span class="mono-small" style="color: var(--color-accent-safe); white-space: nowrap;">
      [加密网链连接] <span class="pulse-dot">■</span>
    </span>
    
    <div class="nav-divider"></div>
    
    <span class="mono-small" style="white-space: nowrap;">时间：{{ time }}</span>
    <span class="mono-small" style="margin-left: 16px; white-space: nowrap;">活动分队：<span style="color: var(--color-accent-sos);">{{ activeUnits }}</span></span>

    <!-- 演示标志 -->
    <div class="demo-badge mono-small" v-if="true">演示环境</div>
  </div>
</template>

<style scoped>
.nav-links {
  display: flex;
  gap: 20px;
  white-space: nowrap;
}
.nav-link {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}
.nav-link:hover {
  color: var(--color-text-primary);
}
.nav-link.active {
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-accent-sos);
}

.pulse-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.demo-badge {
  background-color: rgba(255, 60, 0, 0.15);
  color: var(--color-accent-sos);
  border: 1px solid var(--color-accent-sos);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 24px;
}
</style>
