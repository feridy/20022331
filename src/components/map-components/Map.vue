<template>
  <div ref="map" class="map-container">
    this is a map;
    <div class="leaflet-default-icon-path" width="100px" height="100px;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';

export default {
  data() {
    return {
      Lmap: null,
      cuerrMap: null,
      baseMap: null,
    };
  },
  created() {
    console.log(L);
  },
  mounted() {
    this.Lmap = this.mapInit(this.$refs.map,
      {
        maxBounds: [[0, 0], [3467, 1165]],
        maxZoom: 0,
        minZoom: -1,
      });
    this.baseMap = this.renderImageOverlay('http://leaflet.marsgis.cn/forleaflet/examples/crs-simple/uqm_map_full.png', [3467, 1165]);
    this.baseMap.addTo(this.Lmap);
    this.Lmap.fitBounds([[0, 0], [1165, 3467]]);
    // this.baseMap.setUrl('http://hdwx.museum-edu.cn/uploadfiles/svgmap/20190416/201904161456235018.svg');
  },
  methods: {
    // 转化地图的点位(x,y) => (y,x)
    transformxyToyx(x, y) {
      if (L.Util.isArray(x)) {
        return L.latLng(x[1], x[0]);
      }
      return L.latLng(y, x);
    },
    // 地图初始化方法，来初始化地图对象
    mapInit(mapContainer, option = {}) {
      if (option.maxBounds) {
        option.maxBounds = [
          this.transformxyToyx(option.maxBounds[0]),
          this.transformxyToyx(option.maxBounds[1]),
        ];
      }
      const initOption = {
        crs: L.CRS.Simple,
        zoomControl: false,
        attributionControl: false,
        minZoom: 0,
        maxZoom: 0,
        zoom: 0,
        center: [0, 0],
      };
      Object.assign(initOption, option);
      return L.map(mapContainer, initOption);
    },
    // 渲染地图底图imageOverlay
    renderImageOverlay(imageSrc, size = [0, 0]) {
      const [cornerMin, cornerMax] = [[0, 0], this.transformxyToyx(size)];
      const bounds = L.latLngBounds(cornerMin, cornerMax);
      const baseMap = L.imageOverlay(imageSrc, bounds);
      return baseMap;
    },
    // 切换底层地图
    changeMap(url) {
      let baseMap = {};
      if (this.baseMap) {
        baseMap = this.baseMap.setUrl(url);
      } else {
        baseMap = this.renderImageOverlay(url);
      }

      return baseMap;
    },
  },
};
</script>

<style lang="less" scoped>
  .map-container {
    height: 100vh;
    background-color:aqua;
  }
</style>
