<template>
  <footer class="bottom-bar">
    <div class="bar-left">
      <div class="sys-status">
        <div class="status-box"></div>
        <span>系统就绪</span>
      </div>
      <div class="divider"></div>
      <div class="sys-status">
        <div class="status-box"></div>
        <span>自组网链路稳定</span>
      </div>
    </div>

    <div class="bar-right">
      <span class="incoming-msg">FF-03: 我在2层东北角，发现一名被困人员，需要医疗支持</span>
      <span class="version">V4.2.0-KINETIC</span>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 72px; /* 避开SideNav */
  width: calc(100vw - 72px);
  height: 36px;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 40;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sys-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent-safe);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-box {
  width: 5px;
  height: 5px;
  background-color: var(--color-accent-safe);
}

.divider {
  width: 1px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 32px;
  font-family: var(--font-mono);
  font-size: 11px;
}

.incoming-msg {
  color: var(--color-accent-safe);
  letter-spacing: 0.5px;
}

.version {
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}
</style>
