<script setup>
import TaskCard from './TaskCard.vue'
</script>

<template>
  <div class="task-list">
    <div class="list-header mono-small">
      <span>— 当前活跃任务</span>
    </div>
    
    <TaskCard 
      taskTitle="B栋渗透"
      taskType="执行中"
      typeClass="ACTIVE"
      statusDesc="正在扫描3层"
      :progress="65"
    />
    
    <TaskCard 
      taskTitle="C区供水隔离"
      taskType="待命排队"
      typeClass="QUEUED"
      statusDesc="预计到达: +12分钟 由 UNIT_08 负责"
    />
    
    <TaskCard 
      taskTitle="环境毒性评估"
      taskType="分析中"
      typeClass="ANALYZING"
      statusDesc="数据采集中 [血氧: 98%]"
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
