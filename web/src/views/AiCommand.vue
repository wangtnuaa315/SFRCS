<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../stores/tactical'
import TopCommandBar from '../components/layout/TopCommandBar.vue'
import TargetCard from '../components/ai/TargetCard.vue'
import RecognitionVideoStage from '../components/video/RecognitionVideoStage.vue'

const store = useTacticalStore()
const {
  mapTargets,
  videoChannels,
  selectedMapTargetId,
  activeVideoChannelId,
} = storeToRefs(store)
const taskModalVisible = ref(false)
const taskDraft = reactive({
  targetId: '',
  assignee: 'TL-01',
  priority: '高',
  deadlineMinutes: 3,
  note: '',
})

onMounted(() => {
  store.connectWs()
})

const visibleTargets = computed(() => mapTargets.value.filter((target) => target.status !== 'ignored'))

const suspiciousCount = computed(() => visibleTargets.value.length)
const confirmedCount = computed(() => visibleTargets.value.filter((target) => ['confirmed', 'dispatched', 'accepted', 'processing', 'completed'].includes(target.status)).length)
const pendingCount = computed(() => visibleTargets.value.filter((target) => target.status === 'pending').length)
const completedCount = computed(() => visibleTargets.value.filter((target) => target.status === 'completed').length)

const activeTarget = computed(() => (
  visibleTargets.value.find((target) => target.id === selectedMapTargetId.value) || visibleTargets.value[0] || null
))

const activeChannel = computed(() => (
  videoChannels.value.find((channel) => channel.id === activeVideoChannelId.value) || videoChannels.value[0]
))

const activeChannelIndex = computed(() => (
  Math.max(0, videoChannels.value.findIndex((channel) => channel.id === activeVideoChannelId.value))
))

const activeDetections = computed(() => (
  activeTarget.value && activeTarget.value.videoChannelId === activeChannel.value?.id
    ? [activeTarget.value.detection]
    : []
))

const selectTarget = (targetId) => {
  store.selectMapTarget(targetId)
}

const confirmTarget = (targetId) => {
  store.updateTargetStatus(targetId, 'confirmed')
  store.selectMapTarget(targetId)
}

const dispatchTarget = (targetId) => {
  store.selectMapTarget(targetId)
  taskDraft.targetId = targetId
  taskDraft.assignee = 'TL-01'
  taskDraft.priority = '高'
  taskDraft.deadlineMinutes = 3
  taskDraft.note = ''
  taskModalVisible.value = true
}

const ignoreTarget = (targetId) => {
  store.ignoreTarget(targetId)
}

const restoreTarget = (targetId) => {
  store.restoreIgnoredTarget(targetId)
  store.selectMapTarget(targetId)
}

const advanceTarget = (targetId) => {
  store.advanceTargetWorkflow(targetId)
}

const switchChannel = (channelId) => {
  store.selectVideoChannel(channelId)
}

const closeTaskModal = () => {
  taskModalVisible.value = false
}

const submitTaskDispatch = () => {
  store.createTaskFromTarget({
    targetId: taskDraft.targetId,
    assignee: taskDraft.assignee,
    priority: taskDraft.priority,
    deadlineMinutes: taskDraft.deadlineMinutes,
    note: taskDraft.note,
  })
  taskModalVisible.value = false
}
</script>

<template>
  <div class="ai-command-page">
    <TopCommandBar />

    <div class="ai-command-shell">
      <section class="ai-stats hud-panel">
        <div class="stats-title">本轮识别统计</div>
        <div class="stats-list">
          <div class="stat-block">
            <span class="stat-label mono-small">疑似目标数</span>
            <span class="stat-value mono-normal">{{ suspiciousCount }}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label mono-small">已处理</span>
            <span class="stat-value mono-normal">{{ confirmedCount }}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label mono-small">待确认</span>
            <span class="stat-value mono-normal">{{ pendingCount }}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label mono-small">当前源</span>
            <span class="stat-value mono-normal">{{ activeChannel?.id }}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label mono-small">已完成</span>
            <span class="stat-value mono-normal">{{ completedCount }}</span>
          </div>
        </div>
      </section>

      <section class="ai-main-grid">
        <div class="primary-area hud-panel">
          <div class="primary-header">
            <div class="primary-title-group">
              <span class="primary-title">AI识别主窗口</span>
              <span class="mono-small title-meta">{{ activeChannel?.label }} / {{ activeChannel?.floor }}</span>
            </div>
            <div class="toggle-cluster">
              <button class="toggle-btn active">热成像叠加</button>
              <button class="toggle-btn">毫米波区域</button>
            </div>
          </div>

          <div class="primary-video">
            <RecognitionVideoStage
              :active-channel="activeChannel"
              :active-target="activeTarget"
              :detections="activeDetections"
              :channels="videoChannels"
              :active-channel-index="activeChannelIndex"
              :show-header="false"
              :show-suggestion="false"
              :show-channel-grid="false"
              @switch-channel="switchChannel"
            />

            <div v-if="activeTarget?.distressPhrase" class="subtitle-alert mono-small">
              {{ activeTarget.distressPhrase }}
            </div>

            <div class="mmwave-overlay"></div>
            <div class="thermal-grid"></div>
          </div>

          <div class="suggestion-strip">
            <span class="suggestion-title mono-small">AI建议动作</span>
            <div class="suggestion-list">
              <span class="suggestion-item">▶ {{ activeTarget?.suggestion }}</span>
              <span class="suggestion-item">▶ {{ activeTarget?.source }} 视角已关联到快照卡，可直接确认或派任务</span>
            </div>
          </div>
        </div>

        <aside class="target-sidebar hud-panel">
          <div class="sidebar-header">
            <span class="sidebar-title">目标快照卡片流</span>
            <span class="mono-small sidebar-meta">{{ visibleTargets.length }} 条</span>
          </div>

          <div class="card-stream">
            <TargetCard
              v-for="target in visibleTargets"
              :key="target.id"
              :target="target"
              :selected="target.id === activeTarget?.id"
              @select="selectTarget"
              @confirm="confirmTarget"
              @dispatch="dispatchTarget"
              @ignore="ignoreTarget"
              @restore="restoreTarget"
              @advance="advanceTarget"
            />
          </div>
        </aside>
      </section>

      <section class="channel-strip hud-panel">
        <div
          v-for="(channel, idx) in videoChannels"
          :key="channel.id"
          class="channel-cell"
          :class="{ active: idx === activeChannelIndex, weak: channel.status === 'weak' }"
          @click="switchChannel(channel.id)"
        >
          <div class="channel-preview">
            <div
              v-if="visibleTargets.some(target => target.videoChannelId === channel.id)"
              class="preview-hint"
            ></div>
          </div>
          <div class="channel-meta">
            <span class="mono-small">{{ channel.label }}</span>
            <span class="mono-small channel-floor">{{ channel.floor }}</span>
          </div>
        </div>
      </section>
    </div>

    <div v-if="taskModalVisible" class="task-modal-backdrop" @click.self="closeTaskModal">
      <div class="task-modal hud-panel">
        <div class="modal-header">
          <span class="modal-title">派发任务</span>
          <button class="modal-close" @click="closeTaskModal">×</button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <label class="field-label mono-small">目标</label>
            <div class="field-value">{{ activeTarget?.label }} · {{ activeTarget?.floor }}</div>
          </div>
          <div class="form-row">
            <label class="field-label mono-small">执行人</label>
            <input v-model="taskDraft.assignee" class="field-input" />
          </div>
          <div class="form-row two-col">
            <div class="field-block">
              <label class="field-label mono-small">优先级</label>
              <select v-model="taskDraft.priority" class="field-input">
                <option>高</option>
                <option>中</option>
                <option>低</option>
              </select>
            </div>
            <div class="field-block">
              <label class="field-label mono-small">回执时限</label>
              <select v-model="taskDraft.deadlineMinutes" class="field-input">
                <option :value="3">3 分钟</option>
                <option :value="5">5 分钟</option>
                <option :value="10">10 分钟</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="field-label mono-small">备注</label>
            <textarea
              v-model="taskDraft.note"
              class="field-input field-textarea"
              placeholder="补充处置要点、到达路径或协同要求"
            ></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn" @click="closeTaskModal">取消</button>
          <button class="modal-btn modal-btn-primary" @click="submitTaskDispatch">确认派发</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-command-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-void);
  overflow: hidden;
}

.ai-command-shell {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.ai-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 12px;
}

.stats-title {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent-sos);
  white-space: nowrap;
}

.stats-list {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-block {
  min-width: 110px;
  padding-left: 12px;
  border-left: 1px solid var(--color-border);
}

.stat-label {
  display: block;
}

.stat-value {
  color: var(--color-text-primary);
}

.ai-main-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  gap: 10px;
}

.primary-area {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.primary-header,
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
}

.primary-title-group {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.primary-title,
.sidebar-title {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-accent-sos);
}

.title-meta,
.sidebar-meta {
  color: var(--color-text-muted);
}

.toggle-cluster {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
}

.toggle-btn.active {
  color: var(--color-accent-warning);
  border-color: rgba(245, 158, 11, 0.28);
}

.primary-video {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.subtitle-alert {
  position: absolute;
  left: 10px;
  bottom: 16px;
  z-index: 2;
  padding: 4px 8px;
  background-color: rgba(147, 51, 234, 0.14);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: var(--color-accent-ai);
}

.mmwave-overlay {
  position: absolute;
  top: 30%;
  right: 16%;
  width: 20%;
  height: 28%;
  border: 1px dashed rgba(147, 51, 234, 0.55);
  background: radial-gradient(circle, rgba(147, 51, 234, 0.15), transparent 70%);
}

.suggestion-strip {
  padding: 10px 14px 12px;
  border-top: 1px solid rgba(147, 51, 234, 0.22);
  background-color: rgba(5, 8, 14, 0.96);
}

.suggestion-title {
  color: var(--color-accent-ai);
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.suggestion-item {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-primary);
}

.target-sidebar {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.card-stream {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
}

.channel-cell {
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.channel-cell.active {
  border-color: var(--color-accent-sos);
}

.channel-cell.weak {
  opacity: 0.72;
}

.channel-preview {
  aspect-ratio: 16 / 9;
  position: relative;
  background: radial-gradient(circle at center, rgba(35, 52, 74, 0.75), #030509);
}

.preview-hint {
  position: absolute;
  top: 22%;
  left: 18%;
  width: 32%;
  height: 38%;
  border: 1px solid var(--color-accent-ai);
}

.channel-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
}

.channel-floor {
  color: var(--color-text-muted);
}

.task-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-modal {
  width: min(520px, calc(100vw - 32px));
  border-top: 2px solid rgba(255, 60, 0, 0.4);
}

.modal-header,
.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.modal-actions {
  justify-content: flex-end;
  gap: 8px;
  border-bottom: none;
  border-top: 1px solid var(--color-border);
}

.modal-title {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent-sos);
}

.modal-close {
  min-width: 32px;
  min-height: 32px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  color: var(--color-text-muted);
}

.field-value {
  min-height: 38px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  background-color: rgba(255, 255, 255, 0.02);
}

.field-input {
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  background-color: rgba(255, 255, 255, 0.02);
  color: var(--color-text-primary);
  outline: none;
}

.field-textarea {
  min-height: 90px;
  padding-top: 10px;
  resize: vertical;
}

.modal-btn {
  min-width: 92px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
}

.modal-btn-primary {
  color: var(--color-accent-sos);
  border-color: rgba(255, 60, 0, 0.28);
}

@media (max-width: 1500px) {
  .ai-main-grid {
    grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.95fr);
  }
}
</style>
