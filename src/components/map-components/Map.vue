<template>
  <div class="main-container">
    <h1>这是一个标题</h1>
    <button
      ref="btn"
      @click="changeMap('http://hdwx.museum-edu.cn/uploadfiles/svgmap/20190416/201904161456235018.svg')"
    >切换地图</button>
    <!-- map container -->
    <div ref="map" class="map-container"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';

export default {
  data() {
    return {
      Lmap: null, // 地图的对象-L.map 父级对象
      cuerrMap: null,
      baseMap: null, // 底层地图
      // iconClass: null, // marker的图片类,基本的保持一致的图标类
    };
  },
  computed: {
    // marker的图片类,基本的保持一致的图标类
  },
  created() {
    console.log(L);
    // 自定义的图标类，继承自L.Icon
  },
  mounted() {
    this.Lmap = this.mapInit(this.$refs.map, {
      maxBounds: [[0, 0], [3467, 1165]],
      maxZoom: 1,
      minZoom: -2,
    });
    this.baseMap = this.renderImageOverlay(
      'http://leaflet.marsgis.cn/forleaflet/examples/crs-simple/uqm_map_full.png',
      [3467, 1165],
    );
    this.baseMap.addTo(this.Lmap);
    // eslint-disable-next-line global-require
    L.marker([200, 800], { icon: this.myIcon({ iconUrl: require('assets/marker-icon-2x.png') }) }).addTo(this.Lmap);
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
    // 主要是传入一个对象包含maxBounds:[]最大边界的数组
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
      const Lmap = L.map(mapContainer, initOption);
      Lmap.fitBounds(option.maxBounds || Lmap.getBounds());
      return Lmap;
    },
    // 渲染地图底图imageOverlay
    renderImageOverlay(imageSrc, size = [0, 0]) {
      const [cornerMin, cornerMax] = [[0, 0], this.transformxyToyx(size)];
      const bounds = L.latLngBounds(cornerMin, cornerMax);
      const baseMap = L.imageOverlay(imageSrc, bounds);
      return baseMap;
    },
    // 切换底层地图, 这改变的是底层图片，Lmap没有变化
    changeMap(url) {
      if (this.baseMap) {
        this.baseMap.setUrl(url);
        // 设置中心点的变化为了解决谷歌浏览切换地址，不切换地图的问题
        const center = this.Lmap.getCenter();
        const [X, Y] = [center.lat, center.lng];
        console.log(center);
        this.Lmap.setView([X - 10, Y - 10]);
        this.$nextTick(() => {
          const imageElemet = this.baseMap.getElement();
          console.log(imageElemet);
        });
      } else {
        this.baseMap = this.renderImageOverlay(url);
      }
    },
    // Marker图标
    myIcon(option = {}) {
      const options = {
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      };
      Object.assign(options, option);
      return new L.Icon(options);
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  > h1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background-color: #fff;
    text-align: center;
    z-index: 1000;
  }
  > button {
    position: absolute;
    top: 20px;
    right: 30px;
    background: #ccc;
    border: 1px solid #333;
    // width: 40px;
    font-size: 24px;
    height: 40px;
    z-index: 1001;
  }
  .map-container {
    height: 100vh;
    background-color: aqua;
  }
}
</style>
