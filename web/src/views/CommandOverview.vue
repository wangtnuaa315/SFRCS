<script setup>
import { onMounted } from 'vue'
import { useTacticalStore } from '../stores/tactical'

// 布局组件
import TopCommandBar from '../components/layout/TopCommandBar.vue'
import BottomBar from '../components/layout/BottomBar.vue'

// 地图
import TacticalMap from '../components/map/TacticalMap.vue'

// 中央视频
import MainVideoWindow from '../components/video/MainVideoWindow.vue'

// 右侧面板
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
    <!-- 顶栏：任务信息横条 -->
    <TopCommandBar />

    <!-- 主区域：三列布局 -->
    <div class="main-area">
      <!-- 左列：GIS战术地图 -->
      <div class="left-panel">
        <TacticalMap />
      </div>

      <!-- 中列：主视频 + AI识别 -->
      <div class="center-panel">
        <MainVideoWindow />
      </div>

      <!-- 右列：告警 + 任务 + 人员 -->
      <div class="right-panel">
        <!-- 右上：实时告警列表 -->
        <div class="right-section right-top">
          <AlertList />
        </div>

        <!-- 右中：当前任务列表 -->
        <div class="right-section right-mid">
          <div class="hud-panel task-panel-wrapper">
            <div class="panel-header">
              <div class="header-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span class="panel-title">当前任务</span>
              </div>
              <span class="mono-small task-legend">进行中 / 待回执 / 超时</span>
            </div>
            <div class="task-scroll">
              <TaskList />
            </div>
          </div>
        </div>

        <!-- 右下：人员状态卡片 -->
        <div class="right-section right-bot">
          <PersonnelCards />
        </div>
      </div>
    </div>

    <!-- 底栏：语音转写 + 时间线 + 快捷操作 -->
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

/* 主区域：三列布局，填充顶栏和底栏之间的剩余高度 */
.main-area {
  flex: 1;
  display: flex;
  min-height: 0; /* 关键：让flex子项不溢出 */
  overflow: hidden;
  gap: 0;
}

/* 左列：GIS战术地图，占35% */
.left-panel {
  flex: 0 0 34%;
  min-width: 0;
  position: relative;
  border-right: 1px solid var(--color-border);
  overflow: hidden;
}

/* 中列：主视频AI窗口，占40% */
.center-panel {
  flex: 0 0 38%;
  min-width: 0;
  border-right: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 右列：三段式面板，占25% */
.right-panel {
  flex: 0 0 28%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-section {
  flex: 1 1 0;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}
.right-section:last-child {
  border-bottom: none;
}

.right-top,
.right-mid,
.right-bot {
  min-height: 0;
}

/* 任务面板内部 */
.task-panel-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  font-weight: 700;
  letter-spacing: 0.04em;
}

.panel-title {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-accent-sos);
}

.task-legend {
  color: var(--color-text-muted);
  font-size: 10px;
}

.task-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.task-scroll::-webkit-scrollbar { display: none; }

@media (max-width: 1500px) {
  .left-panel {
    flex-basis: 33%;
  }

  .center-panel {
    flex-basis: 37%;
  }

  .right-panel {
    flex-basis: 30%;
    min-width: 340px;
  }
}
</style>
