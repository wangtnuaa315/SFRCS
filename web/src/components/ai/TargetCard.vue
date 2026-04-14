<script setup>
const props = defineProps({
  target: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'confirm', 'dispatch', 'ignore', 'advance', 'restore'])

const statusTextMap = {
  pending: '待确认',
  confirmed: '已确认',
  dispatched: '已派发',
  accepted: '已接收',
  processing: '处理中',
  completed: '已完成',
  ignored: '已忽略',
}

const statusColorMap = {
  pending: 'var(--color-accent-warning)',
  confirmed: 'var(--color-accent-ai)',
  dispatched: 'var(--color-accent-safe)',
  accepted: 'var(--color-accent-link)',
  processing: 'var(--color-accent-safe)',
  completed: 'var(--color-accent-sos)',
  ignored: 'var(--color-text-muted)',
}

const actionPrimaryLabel = () => {
  if (props.target.status === 'pending') return '确认'
  if (props.target.status === 'confirmed') return '派任务'
  if (props.target.status === 'dispatched') return '标记接收'
  if (props.target.status === 'accepted') return '转处理中'
  if (props.target.status === 'processing') return '标记完成'
  if (props.target.status === 'completed') return '已完成'
  return '已忽略'
}

const actionSecondaryLabel = () => {
  if (props.target.status === 'pending') return '忽略'
  if (props.target.status === 'confirmed') return '定位'
  if (props.target.status === 'dispatched') return '通知'
  if (props.target.status === 'accepted') return '回看'
  if (props.target.status === 'processing') return '回看'
  if (props.target.status === 'completed') return '归档'
  return '恢复'
}

const handlePrimary = () => {
  if (props.target.status === 'pending') {
    emit('confirm', props.target.id)
    return
  }

  if (props.target.status === 'confirmed') {
    emit('dispatch', props.target.id)
    return
  }

  if (['dispatched', 'accepted', 'processing'].includes(props.target.status)) {
    emit('advance', props.target.id)
  }
}

const handleSecondary = () => {
  if (props.target.status === 'pending') {
    emit('ignore', props.target.id)
    return
  }

  if (props.target.status === 'confirmed') {
    emit('select', props.target.id)
    return
  }

  if (['dispatched', 'accepted', 'processing'].includes(props.target.status)) {
    emit('select', props.target.id)
    return
  }

  if (props.target.status === 'ignored') {
    emit('restore', props.target.id)
  }
}
</script>

<template>
  <article
    class="target-card hud-panel"
    :class="{ selected }"
    @click="emit('select', target.id)"
  >
    <div class="card-head">
      <div class="head-main">
        <span
          class="threat-dot"
          :style="{ backgroundColor: statusColorMap[target.status] }"
        ></span>
        <span class="card-title">{{ target.label }}</span>
      </div>
      <span
        class="status-chip mono-small"
        :style="{ color: statusColorMap[target.status] }"
      >
        {{ statusTextMap[target.status] }}
      </span>
    </div>

    <div class="meta-row mono-small">
      <span>位置：{{ target.floor }}</span>
      <span>置信度：{{ target.confidence }}%</span>
    </div>
    <div class="meta-row mono-small">
      <span>时间：{{ target.eventTime }}</span>
      <span>来源：{{ target.source }}</span>
    </div>

    <div v-if="target.distressPhrase" class="distress-line mono-small">
      {{ target.distressPhrase }}
    </div>

    <div class="card-actions">
      <button
        class="action-btn action-btn-primary"
        :disabled="target.status === 'completed' || target.status === 'ignored'"
        @click.stop="handlePrimary"
      >
        {{ actionPrimaryLabel() }}
      </button>
      <button
        class="action-btn"
        @click.stop="handleSecondary"
      >
        {{ actionSecondaryLabel() }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.target-card {
  padding: 14px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: border-color 0.18s, background-color 0.18s;
}

.target-card.selected {
  border-left-color: var(--color-accent-sos);
  background-color: rgba(255, 60, 0, 0.05);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.head-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.status-chip {
  flex-shrink: 0;
  font-size: 11px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  color: var(--color-text-muted);
}

.distress-line {
  margin-top: 10px;
  color: var(--color-accent-warning);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.action-btn {
  flex: 1;
  min-height: 32px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 12px;
  cursor: pointer;
}

.action-btn-primary {
  color: var(--color-accent-sos);
  border-color: rgba(255, 60, 0, 0.28);
}

.action-btn:disabled {
  opacity: 0.55;
  cursor: default;
}
</style>
