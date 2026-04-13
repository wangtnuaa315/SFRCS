<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../stores/tactical'
import TacticalMap from '../components/map/TacticalMap.vue'
import TacticalNavPill from '../components/layout/TacticalNavPill.vue'
import SosAlertCard from '../components/alerts/SosAlertCard.vue'
import TaskList from '../components/mission/TaskList.vue'
import SensorMatrix from '../components/sensors/SensorMatrix.vue'
import VideoCell from '../components/video/VideoCell.vue'

const store = useTacticalStore()
const { personnel, isConnected } = storeToRefs(store)

onMounted(() => {
  store.connectWs()
})

const getMaydayPersonnel = () => {
  return personnel.value.find(p => p.isMayday)
}

const getFocusPersonnel = () => {
  return getMaydayPersonnel() || personnel.value[0] || {}
}
</script>

<template>
  <div class="command-overview">
    <!-- 顶层战术导航 -->
    <header class="top-nav">
      <TacticalNavPill />
    </header>

    <!-- 底层全局态势地图 -->
    <div class="map-layer">
      <TacticalMap />
    </div>

    <!-- 左侧悬浮舱: 视频与传感器矩阵 -->
    <aside class="hud-left">
      <VideoCell title="无人机实时监控" alt="124m" />
      <SensorMatrix :targetPersonnel="getFocusPersonnel()" />
    </aside>

    <!-- 右侧悬浮舱: 严重告警与任务流 -->
    <aside class="hud-right">
      <SosAlertCard 
        v-if="getMaydayPersonnel()"
        :targetId="getMaydayPersonnel().id" 
        reason="生命体征异常" 
        status="MAYDAY: 需要战术撤离" 
        :coordinates="`${getMaydayPersonnel().location[1]} N | ${getMaydayPersonnel().location[0]} E`" 
      />
      <TaskList />
    </aside>

    <!-- 底部状态栏 -->
    <footer class="hud-bottom">
      <div class="status-content">
        <span class="mono-small" style="color: var(--color-accent-safe)" v-if="isConnected">■ 系统正常</span>
        <span class="mono-small" style="color: var(--color-accent-sos)" v-else>■ 系统断开</span>
        
        <span class="mono-small" style="margin-left: 24px;">上行链路: {{ isConnected ? 'SAT_89 活跃' : '等待中' }}</span>
        <span class="mono-small" style="margin-left: 24px;">加密协议: AES_256_RSA</span>
        
        <div style="flex: 1;"></div>
        
        <span class="mono-small" style="color: var(--color-text-muted)">消防搜援指挥系统 v4.2.0 // (C) 2026 搜援一队</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.command-overview {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: var(--color-void);
  overflow: hidden;
}

.map-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.top-nav {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  height: 48px;
}

.hud-left {
  position: absolute;
  top: 96px;
  left: 24px;
  width: 380px;
  bottom: 64px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.hud-left::-webkit-scrollbar { display: none; }

.hud-right {
  position: absolute;
  top: 96px;
  right: 24px;
  width: 400px;
  bottom: 64px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.hud-right::-webkit-scrollbar { display: none; }

.hud-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px;
  background-color: #030509;
  border-top: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  align-items: center;
}

.status-content {
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
}
</style>
