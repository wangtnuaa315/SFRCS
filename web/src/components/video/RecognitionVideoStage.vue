<script setup>
defineProps({
  headerTitle: { type: String, default: '主视频 · AI识别' },
  activeChannel: { type: Object, required: true },
  activeTarget: { type: Object, default: null },
  detections: { type: Array, default: () => [] },
  channels: { type: Array, default: () => [] },
  activeChannelIndex: { type: Number, default: 0 },
  showHeader: { type: Boolean, default: true },
  showSuggestion: { type: Boolean, default: true },
  showChannelGrid: { type: Boolean, default: true },
  suggestionText: { type: String, default: '' },
})

const emit = defineEmits(['switch-channel'])
</script>

<template>
  <div class="recognition-stage">
    <div v-if="showHeader" class="video-header">
      <div class="header-left">
        <span class="header-title">实时视频 // {{ activeChannel?.id || 'NO-SIGNAL' }}</span>
      </div>
      <div class="header-right">
        <span class="rec-label">REC <span class="rec-dot">●</span></span>
      </div>
    </div>

    <div class="main-video-area">
      <div class="video-bg">
        <div class="osd-overlay">

          <div class="osd-item mono-small osd-bl">28.7891N 121.3765E</div>
          <div class="osd-item mono-small osd-br">14:23:45</div>
        </div>

        <div v-if="activeTarget" class="video-target-tag mono-small">
          地图联动 · {{ activeTarget.label }} · {{ activeTarget.floor }}
        </div>

        <div
          v-for="det in detections"
          :key="det.id"
          class="detection-box"
          :style="{
            left: det.x + '%',
            top: det.y + '%',
            width: det.w + '%',
            height: det.h + '%',
            borderColor: det.color,
          }"
        >
          <div class="det-label" :style="{ backgroundColor: det.color }">
            {{ det.label }} // {{ det.confidence }}%
          </div>
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
        </div>

        <div class="scan-line" v-if="detections.length === 0"></div>
        <div class="video-grid"></div>
        <div class="video-bottom-label mono-small">CAM_01_HELMET</div>
      </div>
    </div>

    <div v-if="showChannelGrid" class="video-grid-row">
      <div
        v-for="(ch, idx) in channels"
        :key="ch.id"
        class="video-thumb"
        :class="{ active: idx === activeChannelIndex, weak: ch.status === 'weak' }"
        @click="emit('switch-channel', ch.id)"
      >
        <div class="thumb-bg">
          <div v-if="ch.fallbackDetection" class="thumb-det-hint"></div>
          <div class="weak-overlay" v-if="ch.status === 'weak'">
            <span class="mono-small">信号弱</span>
          </div>
        </div>
        <div class="thumb-label mono-small">{{ ch.label }}</div>
        <div class="thumb-active-indicator" v-if="idx === activeChannelIndex"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recognition-stage {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0; /* Remove horizontal padding since it's aligned */
  background: transparent;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  color: var(--color-accent-sos); /* "#FF3C00" 战术橙红 */
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rec-label {
  color: var(--color-accent-safe); /* 录制状态绿色 */
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.main-video-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.video-bg {
  flex: none;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: radial-gradient(ellipse at 30% 40%, #1a2a3a 0%, var(--color-void) 100%);
  position: relative;
  overflow: hidden;
}

.osd-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.video-target-tag {
  position: absolute;
  top: 32px;
  left: 8px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid rgba(147, 51, 234, 0.4); /* AI 识别紫色外框 */
  border-left: 2px solid rgb(147, 51, 234);
  padding: 4px 8px;
  z-index: 5;
  pointer-events: none;
}

.osd-item {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.65);
  color: var(--color-text-muted);
  padding: 2px 6px;
  font-size: 10px;
  white-space: nowrap;
}

.osd-item:first-child { top: 8px; left: 8px; }
.osd-right { top: 8px; right: 8px; color: var(--color-accent-sos); }
.osd-bl { bottom: 8px; left: 8px; }
.osd-br { bottom: 8px; right: 8px; }

.rec-dot {
  display: inline-block;
  animation: blink-rec 1s step-start infinite;
}

@keyframes blink-rec {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.detection-box {
  position: absolute;
  border: 1.5px solid;
  background-color: rgba(147, 51, 234, 0.08);
}

.det-label {
  position: absolute;
  top: -22px;
  left: -1.5px;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 10px;
  padding: 2px 6px;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: inherit;
  border-style: solid;
  border-width: 0;
}

.corner.tl { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
.corner.tr { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
.corner.bl { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
.corner.br { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 230, 118, 0.4), transparent);
  animation: scan 4s linear infinite;
}

@keyframes scan {
  0% { top: 0%; }
  100% { top: 100%; }
}

.video-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 116, 139, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.video-bottom-label {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(3, 5, 9, 0.85); /* 底部深色半透明遮罩 */
  color: var(--color-text-muted);
  padding: 4px 8px;
  text-align: right;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.video-grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 8px;
  flex-shrink: 0;
}

.video-thumb {
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15); /* Ghost Border */
  transition: all 0.2s ease;
  background-color: rgba(3, 5, 9, 0.5);
  display: flex;
  flex-direction: column;
}

.video-thumb.active {
  border: 1px solid rgba(255, 60, 0, 0.4);
  box-shadow: inset 0 0 12px rgba(255, 60, 0, 0.15);
}

.video-thumb.weak {
  opacity: 0.6;
}

.thumb-bg {
  aspect-ratio: 1 / 1;
  background: radial-gradient(ellipse at center, #1a2a3a 0%, var(--color-void) 100%);
  position: relative;
  overflow: hidden;
  flex: 1;
}

.thumb-label {
  padding: 4px;
  font-size: 9px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.video-thumb.active .thumb-label {
  color: var(--color-accent-sos);
  background-color: rgba(255, 60, 0, 0.1);
  border-top-color: rgba(255, 60, 0, 0.2);
}

.thumb-active-indicator {
  display: none; /* 移除旧的顶部黄条 */
}
</style>
