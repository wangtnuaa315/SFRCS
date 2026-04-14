import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTacticalStore = defineStore('tactical', () => {
  const activePage = ref('overview')
  const personnel = ref([])
  const serverTasks = ref([])
  const localTasks = ref([])
  const aiTargets = ref([])
  const isConnected = ref(false)
  const alerts = ref([
    { id: 'ALT001', level: 'P0', title: 'FF-02 心率异常' },
    { id: 'ALT002', level: 'P0', title: 'SOS 触发' },
  ])
  const videoChannels = ref([
    { id: 'CAM-01', label: 'FF-01 胸挂', floor: '2F', status: 'live', fallbackDetection: false },
    { id: 'CAM-02', label: 'FF-02 胸挂', floor: '2F', status: 'live', fallbackDetection: false },
    { id: 'CAM-03', label: 'UAV-01 俯拍', floor: '1F', status: 'live', fallbackDetection: true },
    { id: 'CAM-04', label: 'FF-04 胸挂', floor: 'B1', status: 'weak', fallbackDetection: false },
  ])
  const mapTargets = ref([
    {
      id: 'TGT-001',
      coords: [121.32, 28.67],
      label: '疑似被困者',
      floor: '2F',
      confidence: 78,
      status: 'pending',
      taskId: null,
      eventTime: '14:23:11',
      source: 'FF-03胸挂',
      distressPhrase: '检测到呼救词：救命',
      videoChannelId: 'CAM-01',
      suggestion: '建议对2层东北区域增派复扫，优先确认被困者生命体征。',
      detection: {
        id: 'DET-001',
        type: 'person_down',
        label: '疑似被困者',
        confidence: 78,
        x: 28,
        y: 32,
        w: 38,
        h: 42,
        color: '#9333EA',
      },
    },
    {
      id: 'TGT-002',
      coords: [121.38, 28.7],
      label: '火点',
      floor: '1F楼梯口',
      confidence: 85,
      status: 'confirmed',
      taskId: null,
      eventTime: '14:24:02',
      source: 'UAV-01俯拍',
      distressPhrase: '',
      videoChannelId: 'CAM-03',
      suggestion: '建议封控1F楼梯口并切换无人机主视角，持续观察火点蔓延方向。',
      detection: {
        id: 'DET-002',
        type: 'fire',
        label: '火点 · 1F楼梯口',
        confidence: 85,
        x: 54,
        y: 36,
        w: 18,
        h: 24,
        color: '#FF3C00',
      },
    },
  ])
  const activeVideoChannelId = ref('CAM-01')
  const selectedMapTargetId = ref('TGT-001')
  const tasks = computed(() => [...localTasks.value, ...serverTasks.value])

  let ws = null

  function connectWs() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      isConnected.value = true
      console.log('[WS] Connected to Tactical Mock Server')
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'SNAPSHOT') {
        personnel.value = msg.data.personnel || []
        serverTasks.value = msg.data.tasks || []
        aiTargets.value = msg.data.aiTargets || []
      }
    }

    ws.onclose = () => {
      isConnected.value = false
      setTimeout(connectWs, 3000) // auto reconnect
    }

    ws.onerror = (err) => {
      console.error('[WS Error]', err)
    }
  }

  function selectMapTarget(targetId) {
    const target = mapTargets.value.find((item) => item.id === targetId)
    if (!target) return
    selectedMapTargetId.value = targetId
    activeVideoChannelId.value = target.videoChannelId
  }

  function selectVideoChannel(channelId) {
    activeVideoChannelId.value = channelId
    const relatedTarget = mapTargets.value.find((item) => item.videoChannelId === channelId)
    if (relatedTarget) {
      selectedMapTargetId.value = relatedTarget.id
    }
  }

  function setActivePage(page) {
    activePage.value = page
  }

  function updateTargetStatus(targetId, status) {
    mapTargets.value = mapTargets.value.map((target) => (
      target.id === targetId
        ? { ...target, status }
        : target
    ))
  }

  function ignoreTarget(targetId) {
    mapTargets.value = mapTargets.value.map((target) => (
      target.id === targetId
        ? { ...target, status: 'ignored' }
        : target
    ))
  }

  function createTaskFromTarget({ targetId, assignee, priority, deadlineMinutes, note }) {
    const target = mapTargets.value.find((item) => item.id === targetId)
    if (!target) return

    const taskTitle = `${target.label}${target.floor ? ` · ${target.floor}` : ''}`
    const taskId = `TASK-${Date.now()}`

    localTasks.value = [
      {
        id: taskId,
        title: taskTitle,
        type: 'ACTIVE',
        progress: 0,
        status: `已派发给 ${assignee} · ${priority}优先级 · ${deadlineMinutes}分钟内回执`,
        stage: 'dispatched',
        assignee,
        priority,
        note,
      },
      ...localTasks.value,
    ]

    mapTargets.value = mapTargets.value.map((item) => (
      item.id === targetId
        ? { ...item, status: 'dispatched', taskId }
        : item
    ))
    selectedMapTargetId.value = targetId
  }

  function advanceTargetWorkflow(targetId) {
    const target = mapTargets.value.find((item) => item.id === targetId)
    if (!target) return

    const nextStatusMap = {
      dispatched: 'accepted',
      accepted: 'processing',
      processing: 'completed',
    }

    const nextStatus = nextStatusMap[target.status]
    if (!nextStatus) return

    mapTargets.value = mapTargets.value.map((item) => (
      item.id === targetId
        ? { ...item, status: nextStatus }
        : item
    ))

    if (target.taskId) {
      localTasks.value = localTasks.value.map((task) => {
        if (task.id !== target.taskId) return task

        if (nextStatus === 'accepted') {
          return {
            ...task,
            type: 'ACTIVE',
            progress: 18,
            stage: 'accepted',
            status: `${task.assignee} 已回执接收，准备前往目标区域`,
          }
        }

        if (nextStatus === 'processing') {
          return {
            ...task,
            type: 'ACTIVE',
            progress: 58,
            stage: 'processing',
            status: `${task.assignee} 处理中 · 已抵达现场并开始处置`,
          }
        }

        return {
          ...task,
          type: 'DONE',
          progress: 100,
          stage: 'completed',
          status: `${task.assignee} 已完成处置并提交结果`,
        }
      })
    }
  }

  function restoreIgnoredTarget(targetId) {
    mapTargets.value = mapTargets.value.map((target) => (
      target.id === targetId
        ? { ...target, status: 'pending' }
        : target
    ))
  }

  return {
    activePage,
    personnel,
    tasks,
    aiTargets,
    alerts,
    isConnected,
    videoChannels,
    mapTargets,
    activeVideoChannelId,
    selectedMapTargetId,
    connectWs,
    selectMapTarget,
    selectVideoChannel,
    setActivePage,
    updateTargetStatus,
    ignoreTarget,
    restoreIgnoredTarget,
    createTaskFromTarget,
    advanceTargetWorkflow,
  }
})
