const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let activeClients = 0;

// 模拟数据源
const mockData = {
  personnel: [
    { id: 'FF-01', location: [139.6917, 35.6895], spO2: 98, hr: 110, temp: 37.1 },
    { id: 'FF-02', location: [139.6920, 35.6890], spO2: 90, hr: 135, temp: 38.2, isMayday: true },
    { id: 'FF-03', location: [139.6910, 35.6905], spO2: 99, hr: 95, temp: 36.8 }
  ],
  tasks: [
    { title: 'B栋渗透', type: 'ACTIVE', progress: 65, status: '正在扫描3层' },
    { title: 'C区供水隔离', type: 'QUEUED', progress: 0, status: 'ETA: +12 MINS' }
  ],
  aiTargets: [
    {
      id: 'AI-892',
      box: [35.6895, 139.6917],
      confidence: 84,
      type: 'signal'
    }
  ]
};

// 播发循环
wss.on('connection', (ws) => {
  activeClients++;
  console.log(`[WS] Client connected. Total: ${activeClients}`);

  const interval = setInterval(() => {
    // 模拟坐标和心跳的动态跳变
    mockData.personnel[0].hr = 100 + Math.floor(Math.random() * 20);
    mockData.personnel[1].hr = 130 + Math.floor(Math.random() * 20);
    
    // 推送全量快照 (在原型阶段为了简单起见推送快照)
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'SNAPSHOT',
        timestamp: new Date().toISOString(),
        data: mockData
      }));
    }
  }, 2000); // 2秒打一次点

  ws.on('close', () => {
    activeClients--;
    clearInterval(interval);
    console.log(`[WS] Client disconnected. Total: ${activeClients}`);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`[SYS] Tactical Mock Server is running on port ${PORT}`);
});
