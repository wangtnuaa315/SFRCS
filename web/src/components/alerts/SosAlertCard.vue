<script setup>
import { computed } from 'vue'

const props = defineProps({
  targetId: { type: String, default: 'FF-02' },
  reason: { type: String, default: '信号丢失' },
  status: { type: String, default: '需要战术撤离' },
  coordinates: { type: String, default: 'UNKNOWN' }
})
</script>

<template>
  <div class="hud-panel-alert sos-card">
    <div class="sos-header">
      <div class="sos-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
        <span class="sans-title">求救 // SOS</span>
      </div>
      <div class="sos-badge mono-small">极危</div>
    </div>
    
    <div class="sos-details">
      <div class="sans-title alert-text">{{ targetId }} {{ reason }}</div>
      <div class="mono-normal detail-text">坐标：{{ coordinates }}</div>
      <div class="sans-body quote-text">"{{ status }}"</div>
    </div>
  </div>
</template>

<style scoped>
.sos-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sos-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-accent-sos);
}

.sos-badge {
  background-color: var(--color-accent-sos);
  color: var(--color-void);
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: bold;
}

.sos-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-text {
  color: var(--color-text-primary);
  font-size: 16px;
}

.detail-text {
  color: var(--color-text-muted);
}

.quote-text {
  color: var(--color-accent-sos);
  font-style: italic;
}
</style>
