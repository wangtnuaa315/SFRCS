<script setup>
import { onMounted } from 'vue'
import { useTacticalStore } from '../stores/tactical'

// 布局组件
import TopCommandBar from '../components/layout/TopCommandBar.vue'
import BottomBar from '../components/layout/BottomBar.vue'
import SideNav from '../components/layout/SideNav.vue'

// 地图
import TacticalMap from '../components/map/TacticalMap.vue'

// 中央视频 -> HUD左侧
import MainVideoWindow from '../components/video/MainVideoWindow.vue'
import SensorMatrix from '../components/sensors/SensorMatrix.vue'

// 右侧面板 -> HUD右侧
import AlertList from '../components/alerts/AlertList.vue'
import TaskList from '../components/mission/TaskList.vue'
import PersonnelCards from '../components/personnel/PersonnelCards.vue'

const store = useTacticalStore()

onMounted(() => {
  store.connectWs()
})
</script>

<template>
  <div class="command-overview">
    <!-- V2版：左侧竖向主路由导航 -->
    <SideNav />

    <!-- 顶栏：系统状态条 (缩进避开SideNav) -->
    <TopCommandBar />

    <!-- 全局底层：GIS战术地图 -->
    <div class="map-layer">
      <TacticalMap />
    </div>

    <!-- 悬浮层：HUD交互面版 (pointer-events: none, 面板本身 pointer-events: auto) -->
    <div class="hud-layer">
      
      <!-- 左侧HUD：视频 + 传感器 -->
      <div class="hud-left panel-column">
        <!-- 视频悬浮窗 -->
        <div class="hud-module module-video">
          <MainVideoWindow />
        </div>
        
        <!-- 环境传感器矩阵 -->
        <div class="hud-module module-sensors">
          <SensorMatrix />
        </div>
      </div>

      <!-- 右侧HUD：告警 + 任务 + 人员 -->
      <div class="hud-right panel-column">
        <div class="hud-module right-section right-top">
          <AlertList />
        </div>

        <div class="hud-module right-section right-mid task-panel-wrapper">
          <div class="task-panel-header">
            <span class="task-panel-title">当前任务列表</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </div>
          <div class="task-scroll">
            <TaskList />
          </div>
        </div>

        <div class="hud-module right-section right-bot">
          <PersonnelCards />
        </div>
      </div>

      <!-- 中底部HUD：环境概要（绝对定位在hud-layer内部，相对hud-layer定位） -->
      <div class="hud-center-bottom">
        <div class="env-summary-panel">
          <div class="env-item">
            <span class="env-label">火情等级</span>
            <span class="env-val" style="color: var(--color-accent-sos);">CAT-03</span>
          </div>
          <div class="env-divider"></div>
          <div class="env-item">
            <span class="env-label">已确认幸存</span>
            <span class="env-val" style="color: var(--color-accent-safe);">02</span>
          </div>
          <div class="env-divider"></div>
          <div class="env-item">
            <span class="env-label">环境风速</span>
            <span class="env-val" style="color: var(--color-text-primary);">NW <span class="mono-normal">14m/s</span></span>
          </div>
          <div class="env-divider"></div>
          <div class="env-item">
            <span class="env-label">链路稳定性</span>
            <span class="env-val" style="color: var(--color-accent-safe);">99.8%</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底栏：系统状态条 (悬浮) -->
    <BottomBar />
  </div>
</template>

<style scoped>
.command-overview {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-void);
  overflow: hidden;
}

/* 主布局 */
.command-overview {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-void);
  overflow: hidden;
  position: relative;
}

/* 底层地理地图层 */
.map-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1; /* 在 SideNav 和 TopBar 之下 */
}

/* 交互悬浮层 (HUD) */
.hud-layer {
  position: absolute;
  top: 72px; /* 顶栏56px + 16px Padding */
  left: 88px; /* 左导72px + 16px Padding */
  right: 16px; /* 16px Padding */
  bottom: 36px; /* 底栏高度36px */
  z-index: 10;
  pointer-events: none; /* 让点击穿透到底层地图 */
  display: flex;
  justify-content: space-between; /* 左右HUD分开 */
}

.panel-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.hud-left {
  width: 320px; /* Video is square + 4 inputs, 320 is a good size */
}

.hud-right {
  width: 320px;
  padding-bottom: 16px; /* 与底栏保持间距，体现浮层效果 */
}

.hud-module {
  pointer-events: auto; /* 恢复 HUD 本身的点击交互 */
  background-color: var(--color-surface-container-low, #181C21);
  border: 1px solid var(--color-border);
  border-radius: 8px !important; /* 修改为圆润风格，强制覆盖 */
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  transform: translateZ(0); /* 强制剪裁内部合成层圆角 */
}

/* 左侧具体尺寸 */
.module-video {
  height: max-content;
  flex-shrink: 0;
}

.module-sensors {
  flex-shrink: 0;
  height: max-content;
}

/* 右侧具体尺寸 */
.right-section {
  display: flex;
  flex-direction: column;
}

.right-section.right-top {
  flex: 2;
  min-height: 0;
}

.right-section.right-mid {
  flex: 1.5;
  min-height: 0;
}

.right-section.right-bot {
  flex: 1.2;
  min-height: 0;
}

/* 覆盖原始组件内样式的一些适配 */
.task-panel-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
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
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-accent-sos);
}

.task-legend {
  color: var(--color-text-muted);
  font-size: 10px;
}

.task-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.02);
}

.task-panel-title {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.task-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}
.task-scroll::-webkit-scrollbar { display: none; }

/* 中央底部浮层 */
.hud-center-bottom {
  position: absolute;
  bottom: 8px; /* 离底栏8px，体现悬浮 */
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 20;
}

.env-summary-panel {
  display: flex;
  align-items: stretch;
  width: 420px;
  height: 56px;
  background: rgba(10, 14, 20, 0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 60, 0, 0.18);
  border-radius: 8px !important; /* 修改为圆润风格，强制覆盖 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.04);
}

.env-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 0 8px;
}

.env-divider {
  width: 1px;
  background: rgba(255, 60, 0, 0.15);
  margin: 10px 0;
}

.env-label {
  color: var(--color-text-muted);
  font-size: 9px;
  font-family: var(--font-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.env-val {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
}

.env-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
