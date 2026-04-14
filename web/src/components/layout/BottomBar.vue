<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 模拟语音转写流
const transcripts = ref([
  { id: 1, speaker: 'FF-01', text: '进入2层，正在向东北方向搜索', time: '14:23:11', type: 'normal' },
  { id: 2, speaker: 'TL-01', text: '收到，注意右侧烟雾浓度', time: '14:23:18', type: 'cmd' },
  { id: 3, speaker: 'FF-02', text: '发现一名男性，意识清醒，请求担架 // 位置2F东北角', time: '14:23:45', type: 'event' },
])

// 关键事件时间线
const events = ref([
  { id: 1, time: '14:18', label: 'SOS触发', color: 'var(--color-accent-sos)' },
  { id: 2, time: '14:20', label: '链路降级', color: 'var(--color-accent-warning)' },
  { id: 3, time: '14:23', label: '发现被困者', color: 'var(--color-accent-ai)' },
])

// 模拟滚动新语音
let timer = null
const newTexts = [
  { speaker: 'FF-03', text: '3层楼梯口发现热源，疑似火点', type: 'event' },
  { speaker: 'IC',    text: '注意！3层楼梯间禁止通行', type: 'cmd' },
  { speaker: 'FF-01', text: '收到，绕行西侧通道', type: 'normal' },
]
let newIdx = 0

onMounted(() => {
  timer = setInterval(() => {
    const item = newTexts[newIdx % newTexts.length]
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
    transcripts.value.push({ id: Date.now(), ...item, time })
    if (transcripts.value.length > 8) transcripts.value.shift()
    newIdx++
  }, 5000)
})

onUnmounted(() => clearInterval(timer))

const textColor = (type) => {
  if (type === 'event') return 'var(--color-accent-ai)'
  if (type === 'cmd') return 'var(--color-accent-safe)'
  return 'var(--color-text-muted)'
}
</script>

<template>
  <footer class="bottom-bar">
    <!-- 语音转写滚动条 -->
    <div class="voice-section">
      <div class="section-label mono-small">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        语音转写
      </div>
      <div class="voice-scroll">
        <transition-group name="slide-up" tag="div" class="voice-items">
          <div v-for="t in transcripts" :key="t.id" class="voice-item">
            <span class="mono-small speaker" :style="{ color: textColor(t.type) }">{{ t.speaker }}</span>
            <span class="mono-small voice-text" :style="{ color: textColor(t.type) }">{{ t.text }}</span>
            <span class="mono-small voice-time">{{ t.time }}</span>
          </div>
        </transition-group>
      </div>
    </div>

    <div class="bar-divider"></div>

    <!-- 关键事件时间线 -->
    <div class="timeline-section">
      <div class="section-label mono-small">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        事件时间线
      </div>
      <div class="timeline">
        <div v-for="ev in events" :key="ev.id" class="timeline-event">
          <div class="ev-dot" :style="{ backgroundColor: ev.color }"></div>
          <div class="ev-info">
            <span class="mono-small ev-time">{{ ev.time }}</span>
            <span class="mono-small ev-label" :style="{ color: ev.color }">{{ ev.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bar-divider"></div>

    <!-- 快捷操作 -->
    <div class="quick-actions-section">
      <div class="section-label mono-small">快捷操作</div>
      <div class="quick-btns">
        <button class="quick-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          一键截图
        </button>
        <button class="quick-btn quick-btn-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          派发任务
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.bottom-bar {
  height: 56px;
  background-color: rgba(3, 5, 9, 0.95);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 0;
  flex-shrink: 0;
  overflow: hidden;
}

.bar-divider {
  width: 1px;
  height: 36px;
  background-color: var(--color-border);
  flex-shrink: 0;
  margin: 0 12px;
}

.section-label {
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* 语音转写区 */
.voice-section {
  flex: 1.5;
  min-width: 0;
  overflow: hidden;
}

.voice-scroll {
  overflow: hidden;
  height: 28px;
}

.voice-items {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 100%;
}

.voice-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  font-size: 11px;
}

.speaker {
  font-weight: bold;
  font-size: 10px;
}

.voice-text {
  font-size: 11px;
}

.voice-time {
  font-size: 9px;
  color: rgba(100, 116, 139, 0.5);
}

/* 时间线区 */
.timeline-section {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.timeline {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 28px;
}

.timeline-event {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.ev-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ev-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.2;
}

.ev-time {
  font-size: 9px;
  color: var(--color-text-muted);
}

.ev-label {
  font-size: 10px;
}

/* 快捷操作区 */
.quick-actions-section {
  flex: 0 0 auto;
}

.quick-btns {
  display: flex;
  gap: 6px;
  height: 28px;
  align-items: center;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  border-radius: 2px;
}

.quick-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.quick-btn-alert {
  border-color: rgba(0, 230, 118, 0.3);
  color: var(--color-accent-safe);
}

.quick-btn-alert:hover {
  background-color: rgba(0, 230, 118, 0.1);
  border-color: var(--color-accent-safe);
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
