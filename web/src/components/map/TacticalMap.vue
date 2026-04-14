<script setup>
// MapLibre GL 核心地图容器 - 战术俯视风格
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTacticalStore } from '../../stores/tactical'
import { storeToRefs } from 'pinia'

const mapContainer = ref(null)
let map = null
const markers = new Map()
const targetMarkers = new Map()
let routeAnimationId = null

// 楼层切换状态
const activeFloor = ref('卫星')
const floors = ['卫星', 'B1', '1F', '2F', '3F']

const store = useTacticalStore()
const { personnel, mapTargets, selectedMapTargetId } = storeToRefs(store)

// ── 标记点样式 ──────────────────────────────────────────
const createMarkerElement = (person) => {
  const el = document.createElement('div')
  el.className = person.isMayday ? 'tactical-marker mayday' : 'tactical-marker normal'
  el.innerHTML = `
    <div class="marker-core"></div>
    <div class="marker-ring"></div>
    <div class="marker-label mono-small">${person.id}</div>
  `
  return el
}

const createPopupHTML = (p) => {
  const color = p.isMayday ? 'var(--color-accent-sos)' : 'var(--color-accent-safe)'
  const status = p.isMayday ? 'MAYDAY / 需要撤离' : 'ACTIVE / 状态正常'
  return `
    <div class="tactical-popup">
      <div class="popup-title" style="color: ${color}">
        <span class="pulse-indicator" style="background-color: ${color}"></span>
        ${p.id} [${p.isMayday ? '极危' : '安全'}]
      </div>
      <div class="popup-row">楼层: ${p.floor || '—'}</div>
      <div class="popup-row">心率: ${p.hr} BPM</div>
      <div class="popup-row">血氧: ${p.spO2}%</div>
      <div class="popup-row" style="margin-top: 8px;">状态: ${status}</div>
    </div>
  `
}

// 疑似目标点 Marker
const createTargetMarker = (t) => {
  const el = document.createElement('div')
  el.className = 'target-marker'
  const color = t.status === 'confirmed' ? '#FF3C00' : '#9333EA'
  el.innerHTML = `
    <div class="target-core" style="border-color:${color}">
      <div class="target-center" style="background:${color}"></div>
    </div>
    <div class="target-pulse-ring" style="border-color:${color}"></div>
    <div class="target-label" style="color:${color};border-color:${color}">${t.label} · ${t.floor}<span class="target-conf">${t.confidence}%</span></div>
  `
  return el
}

// ── 地图初始化 ──────────────────────────────────────────
onMounted(() => {
  const tileUrl = import.meta.env.VITE_TILE_URL ||
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: ''
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#030509' }
        },
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22,
          paint: {
            'raster-opacity': 0.88,        // 稍微降低透明度，融合深色底
            'raster-brightness-min': 0.05, // 防止过白
            'raster-brightness-max': 0.85, // 限制过亮，保留科技感
            'raster-saturation': 0.15,     // 轻微去饱和度，接近截图效果
            'raster-contrast': 0.1         // 增加对比度
          }
        }
      ]
    },
    // ✅ 修正：中心点改为台州（对应截图地貌）
    center: [121.35, 28.65],
    // ✅ 修正：缩放改为10，与截图的"可见海岸线+山地+城市"比例一致
    zoom: 10,
    pitch: 0,
    bearing: 0,
    interactive: true,
    attributionControl: false
  })

  map.on('load', () => {
    // 路线数据源
    map.addSource('route-source', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
    })

    map.addLayer({
      id: 'route-base',
      type: 'line',
      source: 'route-source',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#1E293B', 'line-width': 2 }
    })

    map.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route-source',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#00E676',
        'line-width': 2,
        'line-dasharray': [0, 4, 3]
      }
    })

    animateLine()

    syncTargetMarkers(mapTargets.value)
  })

  map.on('error', (e) => {
    console.warn('[TacticalMap] 瓦片加载失败，保持暗色底图模式', e)
  })
})

// ── 调度线路动画 ────────────────────────────────────────
const updateRouteLine = () => {
  if (!map || !map.getSource('route-source')) return
  const normal = personnel.value.find(p => !p.isMayday)
  const mayday = personnel.value.find(p => p.isMayday)
  if (normal && mayday) {
    map.getSource('route-source').setData({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [normal.location, mayday.location] }
    })
  }
}

let step = 0
const animateLine = () => {
  if (!map || !map.getLayer('route-glow')) return
  step = (step + 1) % 100
  map.setPaintProperty('route-glow', 'line-dasharray', [step / 10, 2, 4])
  routeAnimationId = requestAnimationFrame(animateLine)
}

// ── 人员 Marker 更新 ────────────────────────────────────
watch(personnel, (newVal) => {
  if (!map || !map.loaded()) {
    map.once('load', () => updateMarkersAndLine(newVal))
  } else {
    updateMarkersAndLine(newVal)
  }
}, { deep: true })

const updateMarkersAndLine = (newVal) => {
  newVal.forEach(p => {
    let marker = markers.get(p.id)
    if (!marker) {
      const el = createMarkerElement(p)
      const popup = new maplibregl.Popup({ offset: [0, -8], closeButton: false, anchor: 'bottom' })
        .setHTML(createPopupHTML(p))
      marker = new maplibregl.Marker({ element: el })
        .setLngLat(p.location)
        .setPopup(popup)
        .addTo(map)
      markers.set(p.id, marker)
      if (p.isMayday && !marker.hasFlown) {
        marker.hasFlown = true
        map.flyTo({ center: p.location, zoom: 14, pitch: 20, speed: 1.2 })
      }
    } else {
      marker.setLngLat(p.location)
      if (marker.getPopup().isOpen()) {
        marker.getPopup().setHTML(createPopupHTML(p))
      }
    }
  })
  updateRouteLine()
}

const syncTargetMarkers = (targets) => {
  if (!map) return

  targetMarkers.forEach((marker, markerId) => {
    if (!targets.find((target) => target.id === markerId)) {
      marker.remove()
      targetMarkers.delete(markerId)
    }
  })

  targets.forEach((target) => {
    const color = target.status === 'confirmed' ? '#FF3C00' : '#9333EA'
    let marker = targetMarkers.get(target.id)

    if (!marker) {
      const el = createTargetMarker(target)
      el.addEventListener('click', () => {
        store.selectMapTarget(target.id)
      })

      marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(target.coords)
        .setPopup(
          new maplibregl.Popup({ offset: [0, -10], closeButton: false, maxWidth: '220px', anchor: 'bottom' })
            .setHTML(`
              <div class="tactical-popup">
                <div class="popup-title" style="color:${color}">
                  <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:4px"></span>
                  ${target.label} · ${target.floor}
                </div>
                <div class="popup-row">置信度: ${target.confidence}%</div>
                <div class="popup-row">状态: ${target.status === 'confirmed' ? '已确认' : '待确认'}</div>
                <div class="popup-row">来源视频: ${target.videoChannelId}</div>
              </div>
            `)
        )
        .addTo(map)

      targetMarkers.set(target.id, marker)
    } else {
      marker.setLngLat(target.coords)
    }
  })

  updateSelectedTargetStyle(selectedMapTargetId.value)
}

const updateSelectedTargetStyle = (selectedId) => {
  targetMarkers.forEach((marker, markerId) => {
    const el = marker.getElement()
    el.classList.toggle('is-selected', markerId === selectedId)
  })
}

watch(mapTargets, (targets) => {
  if (!map || !map.loaded()) return
  syncTargetMarkers(targets)
}, { deep: true })

watch(selectedMapTargetId, (selectedId) => {
  updateSelectedTargetStyle(selectedId)
}, { immediate: true })

onUnmounted(() => {
  if (routeAnimationId) cancelAnimationFrame(routeAnimationId)
  if (map) map.remove()
})
</script>

<template>
  <div class="tactical-map-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <!-- 战术网格叠加 -->
    <div class="tactical-grid-overlay"></div>

    <!-- 十字准星（中心参考点） -->
    <div class="map-crosshair"></div>

    <!-- 楼层切换控件 -->
    <div class="floor-switcher">
      <button
        v-for="f in floors"
        :key="f"
        class="floor-btn mono-small"
        :class="{ active: activeFloor === f }"
        @click="activeFloor = f"
      >{{ f }}</button>
    </div>
  </div>
</template>

<style>
/* 全局：MapLibre 弹窗重写 */
.maplibregl-popup-content {
  background-color: rgba(10, 13, 20, 0.92) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid #1E293B !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6) !important;
  color: #F8FAFC !important;
  padding: 12px !important;
  border-radius: 0 !important;
}
.maplibregl-popup-tip { display: none !important; }

.tactical-popup .popup-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #F8FAFC;
}
.tactical-popup .popup-row {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #64748B;
  margin-top: 4px;
}
.pulse-indicator {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse-indicator 1s infinite;
}
@keyframes pulse-indicator {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>

<style>
/* 队员 Marker 全局样式 */
.tactical-marker {
  width: 24px;
  height: 24px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.marker-core {
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  z-index: 2;
}
.marker-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  animation: radar-ping 2s infinite cubic-bezier(0, 0, 0.2, 1);
}
.tactical-marker.normal .marker-ring {
  background-color: rgba(0, 230, 118, 0.5);
}
.tactical-marker.mayday .marker-core {
  background-color: #FF3C00;
}
.tactical-marker.mayday .marker-ring {
  background-color: rgba(255, 60, 0, 0.5);
  animation-duration: 1s;
}
.marker-label {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background-color: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 2px 8px;
  border-radius: 2px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  pointer-events: none;
  z-index: 99;
}
@keyframes radar-ping {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* 仓库点位 */
.wh-marker {
  position: relative;
  cursor: pointer;
}
.wh-pulse-ring {
  position: absolute;
  top: -4px; left: -4px; right: -4px; bottom: -4px;
  border-radius: 7px;
  border: 1.5px solid;
  animation: wh-ping 2s infinite ease-out;
  pointer-events: none;
}
.target-ring {
  border-color: #FF3C00;
}
@keyframes wh-ping {
  0% { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}
</style>

<style scoped>
.tactical-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  background-color: var(--color-void);
}

/* 战术网格叠加 */
.tactical-grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image:
    linear-gradient(rgba(100, 116, 139, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.07) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* 中心准星 */
.map-crosshair {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 30px; height: 30px;
  pointer-events: none;
  z-index: 2;
}
.map-crosshair::before,
.map-crosshair::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.25);
}
.map-crosshair::before { top: 50%; left: -50%; width: 200%; height: 1px; }
.map-crosshair::after  { top: -50%; left: 50%; width: 1px; height: 200%; }

/* 楼层切换控件 */
.floor-switcher {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.floor-btn {
  padding: 4px 8px;
  background-color: rgba(10, 13, 20, 0.85);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 11px;
  transition: all 0.15s;
  backdrop-filter: blur(8px);
  border-radius: 2px;
  text-align: center;
  min-width: 32px;
}
.floor-btn:hover {
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}
.floor-btn.active {
  color: var(--color-accent-safe);
  border-color: var(--color-accent-safe);
  background-color: rgba(0, 230, 118, 0.08);
}

/* 疑似目标点 Marker 样式（全局，因为是动态创建的DOM） */
</style>

<style>
.target-marker {
  width: 22px;
  height: 22px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.target-marker.is-selected .target-core {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.12);
}
.target-marker.is-selected .target-label {
  background-color: rgba(8, 11, 18, 0.94);
}
.target-core {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 2;
}
.target-center {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.target-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid;
  animation: target-ping 1.8s ease-out infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes target-ping {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
  100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
}

/* 目标点标签 */
.target-label {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.82);
  border: 1px solid;
  padding: 2px 7px;
  border-radius: 2px;
  white-space: nowrap;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  pointer-events: none;
  z-index: 99;
  display: flex;
  align-items: center;
  gap: 4px;
}
.target-conf {
  opacity: 0.65;
  font-size: 9px;
}
</style>
