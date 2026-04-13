import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTacticalStore = defineStore('tactical', () => {
  const personnel = ref([])
  const tasks = ref([])
  const aiTargets = ref([])
  const isConnected = ref(false)

  let ws = null

  function connectWs() {
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
        tasks.value = msg.data.tasks || []
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

  return { personnel, tasks, aiTargets, isConnected, connectWs }
})
