<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'
import RecognitionVideoStage from './RecognitionVideoStage.vue'

const store = useTacticalStore()
const { videoChannels, mapTargets, activeVideoChannelId, selectedMapTargetId } = storeToRefs(store)

const activeChannel = computed(() => {
  return videoChannels.value.find((channel) => channel.id === activeVideoChannelId.value) || videoChannels.value[0]
})

const activeChannelIndex = computed(() => {
  return Math.max(0, videoChannels.value.findIndex((channel) => channel.id === activeVideoChannelId.value))
})

const activeTarget = computed(() => {
  return mapTargets.value.find((target) => target.id === selectedMapTargetId.value) || null
})

const detections = computed(() => {
  if (activeTarget.value && activeTarget.value.videoChannelId === activeChannel.value?.id) {
    return [activeTarget.value.detection]
  }

  if (activeChannel.value?.fallbackDetection) {
    const fallbackTarget = mapTargets.value.find((target) => target.videoChannelId === activeChannel.value.id)
    return fallbackTarget ? [fallbackTarget.detection] : []
  }

  return []
})

const switchChannel = (channelId) => {
  store.selectVideoChannel(channelId)
}
</script>

<template>
  <div class="main-video-window">
    <RecognitionVideoStage
      :active-channel="activeChannel"
      :active-target="activeTarget"
      :detections="detections"
      :channels="videoChannels"
      :active-channel-index="activeChannelIndex"
      :suggestion-text="activeTarget?.suggestion || ''"
      @switch-channel="switchChannel"
    />
  </div>
</template>

<style scoped>
.main-video-window {
  height: 100%;
  min-height: 0;
}
</style>
