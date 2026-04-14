<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from './stores/tactical'
import CommandOverview from './views/CommandOverview.vue'
import AiCommand from './views/AiCommand.vue'

const store = useTacticalStore()
const { activePage } = storeToRefs(store)

const currentView = computed(() => (
  activePage.value === 'ai' ? AiCommand : CommandOverview
))
</script>

<template>
  <component :is="currentView" />
</template>

<style>
/* 骨架样式由全局 global.css 和 CommandOverview 内部处理 */
</style>
