<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTacticalStore } from '../../stores/tactical'
import TaskCard from './TaskCard.vue'

const store = useTacticalStore()
const { tasks } = storeToRefs(store)

const mappedTasks = computed(() => {
  if (tasks.value?.length) {
    return tasks.value.map((task) => {
      const typeClass = task.type || 'QUEUED'
      const taskTypeMap = {
        ACTIVE: '执行中',
        QUEUED: '待命排队',
        ANALYZING: '分析中',
        DONE: '已完成',
      }

      return {
        id: task.id || task.title,
        taskTitle: task.title,
        taskType: taskTypeMap[typeClass] || typeClass,
        typeClass,
        statusDesc: task.status,
        progress: task.progress || 0,
      }
    })
  }

  return [
    {
      id: 'fallback-1',
      taskTitle: 'B栋渗透',
      taskType: '执行中',
      typeClass: 'ACTIVE',
      statusDesc: '正在扫描3层',
      progress: 65,
    },
    {
      id: 'fallback-2',
      taskTitle: 'C区供水隔离',
      taskType: '待命排队',
      typeClass: 'QUEUED',
      statusDesc: '预计到达: +12分钟 由 UNIT_08 负责',
      progress: 0,
    },
    {
      id: 'fallback-3',
      taskTitle: '环境毒性评估',
      taskType: '分析中',
      typeClass: 'ANALYZING',
      statusDesc: '数据采集中 [血氧: 98%]',
      progress: 0,
    },
  ]
})
</script>

<template>
  <div class="task-list">
    <div class="list-header mono-small">
      <span>— 当前活跃任务</span>
    </div>

    <TaskCard
      v-for="task in mappedTasks"
      :key="task.id"
      :task-title="task.taskTitle"
      :task-type="task.taskType"
      :type-class="task.typeClass"
      :status-desc="task.statusDesc"
      :progress="task.progress"
    />
  </div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list-header {
  color: var(--color-accent-safe);
  margin-bottom: 4px;
  letter-spacing: 0.1em;
}
</style>
