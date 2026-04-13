<script setup>
defineProps({
  title: { type: String, default: '无人机实时监控' },
  alt: { type: String, default: '124m' },
  isRecording: { type: Boolean, default: true }
})
</script>

<template>
  <div class="hud-panel video-cell">
    <div class="video-header">
      <div class="title-group">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video" style="color: var(--color-text-muted)"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
        <span class="sans-title">{{ title }}</span>
      </div>
      <span class="mono-small" style="color: var(--color-accent-ai);">高度: {{ alt }}</span>
    </div>
    
    <div class="video-container">
      <!-- 占位视频区域 -->
      <div class="video-placeholder">
        <div class="crosshair-center"></div>
        <div class="osd mono-small" style="top: 8px; left: 8px;">纬度: 35.6895</div>
        <div class="osd mono-small" style="top: 24px; left: 8px;">经度: 139.6917</div>
        <div class="osd mono-small" v-if="isRecording" style="bottom: 8px; right: 8px;">
          录制中 <span class="pulse-dot" style="color: var(--color-accent-sos); display: inline-block;">■</span>
        </div>
        
        <!-- AI识别覆盖层 Mock -->
        <div class="ai-box">
          <div class="ai-label">[疑似目标 // 84% 置信度]</div>
          <div class="ai-label-sub">[信号]</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-cell {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: var(--color-void);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1e293b 0%, #030509 100%);
  position: relative;
}

.osd {
  position: absolute;
  background-color: rgba(0,0,0,0.6);
  padding: 2px 6px;
  border-radius: 2px;
}

.crosshair-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}
.crosshair-center::before, .crosshair-center::after {
  content: '';
  position: absolute;
  background-color: rgba(255,255,255,0.2);
}
.crosshair-center::before { top: 50%; left: 0; width: 100%; height: 1px; }
.crosshair-center::after { left: 50%; top: 0; width: 1px; height: 100%; }

.ai-box {
  position: absolute;
  top: 30%;
  left: 20%;
  width: 40%;
  height: 40%;
  border: 2px solid var(--color-accent-ai);
  background-color: rgba(147, 51, 234, 0.1);
}

.ai-label {
  position: absolute;
  top: -24px;
  left: -2px;
  background-color: var(--color-accent-ai);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 10px;
  padding: 2px 4px;
  white-space: nowrap;
}

.ai-label-sub {
  position: absolute;
  bottom: 4px;
  left: 4px;
  color: var(--color-accent-ai);
  font-family: var(--font-sans);
  font-size: 10px;
}

.pulse-dot {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
