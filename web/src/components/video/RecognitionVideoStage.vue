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
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
        <span class="mono-small header-title">{{ headerTitle }}</span>
        <div class="live-badge">LIVE</div>
      </div>
      <div class="header-right">
        <span class="mono-small">{{ activeChannel?.label }}</span>
        <span class="mono-small channel-floor">{{ activeChannel?.floor }}</span>
      </div>
    </div>

    <div class="main-video-area">
      <div class="video-bg">
        <div class="osd-overlay">
          <div class="osd-item mono-small">CAM: {{ activeChannel?.id }}</div>
          <div class="osd-item mono-small osd-right">
            REC <span class="rec-dot">●</span>
          </div>
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
      </div>

      <div v-if="showSuggestion && activeTarget" class="ai-suggestion-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 0-2 0v-.07A8 8 0 0 1 4.07 9H5a1 1 0 0 0 0-2h-.93A8 8 0 0 1 11 4.07V5a1 1 0 0 0 2 0v-.93A8 8 0 0 1 19.93 11H19a1 1 0 0 0 0 2h.93A8 8 0 0 1 13 19.93z"/></svg>
        <span class="mono-small suggestion-label">AI建议</span>
        <span class="sans-body suggestion-text">{{ suggestionText }}</span>
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
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  color: var(--color-text-primary);
}

.channel-floor {
  color: var(--color-text-muted);
  font-size: 10px;
}

.live-badge {
  background-color: var(--color-accent-sos);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 2px;
  letter-spacing: 0.1em;
}

.main-video-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.video-bg {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 40%, #1a2a3a 0%, #030509 100%);
  position: relative;
  overflow: hidden;
}

.osd-overlay {
  position: absolute;
  inset: 0;
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

.video-target-tag {
  position: absolute;
  top: 36px;
  left: 8px;
  z-index: 2;
  color: var(--color-accent-warning);
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 3px 8px;
}

.ai-suggestion-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 12px;
  background-color: rgba(3, 5, 9, 0.88);
  border-top: 1px solid rgba(147, 51, 234, 0.25);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
}

.suggestion-label {
  color: var(--color-accent-ai);
}

.suggestion-text {
  font-size: 12px;
}

.video-grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px;
  flex-shrink: 0;
  border-top: 1px solid var(--color-border);
  background-color: rgba(0, 0, 0, 0.3);
}

.video-thumb {
  position: relative;
  cursor: pointer;
  border: 1px solid var(--color-border);
  transition: border-color 0.15s;
}

.video-thumb:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.video-thumb.active {
  border-color: var(--color-accent-safe);
}

.video-thumb.weak {
  opacity: 0.6;
}

.thumb-bg {
  aspect-ratio: 16/9;
  background: radial-gradient(ellipse at center, #1a2a3a 0%, #030509 100%);
  position: relative;
  overflow: hidden;
}

.thumb-det-hint {
  position: absolute;
  top: 20%;
  left: 15%;
  width: 40%;
  height: 45%;
  border: 1px solid var(--color-accent-ai);
  opacity: 0.7;
}

.weak-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.thumb-label {
  padding: 2px 4px;
  font-size: 9px;
  color: var(--color-text-muted);
  background-color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumb-active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-accent-safe);
}
</style>
