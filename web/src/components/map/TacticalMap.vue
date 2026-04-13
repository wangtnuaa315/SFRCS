<script setup>
// MapLibre GL 核心地图容器 - 战术俯视风格
import { onMounted, onUnmounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const mapContainer = ref(null)
let map = null

onMounted(() => {
  // 从环境变量读取，生产时切换为本地 TileServer GL 离线瓦片
  const tileUrl = import.meta.env.VITE_TILE_URL || 
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  
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
          paint: { 'background-color': '#030509' } // 底色与 VOID 颜色一致
        },
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22,
          paint: {
            'raster-brightness-min': 0,
            'raster-brightness-max': 0.55, // 亮度提高到 55%，深色模式下可见
            'raster-contrast': 0.2,        // 轻提对比度
            'raster-saturation': -0.9,     // 彻底去色，让地图呈冷灰色
            'raster-opacity': 1
          }
        }
      ]
    },
    center: [116.3912, 39.9073], // 北京中心，实际部署时由任务数据驱动
    zoom: 15,
    pitch: 0,   // 规范要求：俯视平面，保证威严感，不允许倾斜遮挡
    bearing: 0,
    interactive: true,
    attributionControl: false // 隐藏版权水印，战术界面不需要
  })

  map.on('load', () => {
    // 地图加载成功后的预留挂载点（Marker、GeoJSON图层等）
  })

  map.on('error', (e) => {
    console.warn('[TacticalMap] 瓦片加载失败，保持暗色底图模式', e)
  })
})

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<template>
  <div class="tactical-map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <div class="tactical-grid-overlay"></div>
    <div class="map-crosshair"></div>
  </div>
</template>

<style scoped>
.tactical-map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.tactical-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  /* 战术网格叠加：极细低透明度的边框格 */
  background-image: 
    linear-gradient(rgba(100, 116, 139, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.08) 1px, transparent 1px);
  background-size: 80px 80px;
}

.map-container {
  width: 100%;
  height: 100%;
  /* 深渊黑底色，确保加载瓦片前不突兀 */
  background-color: var(--color-void);
}

.map-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  pointer-events: none;
  z-index: 2;
}
.map-crosshair::before,
.map-crosshair::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.3);
}
.map-crosshair::before {
  top: 50%;
  left: -50%;
  width: 200%;
  height: 1px;
}
.map-crosshair::after {
  top: -50%;
  left: 50%;
  width: 1px;
  height: 200%;
}
</style>
