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
      maxZoom: 2,
      minZoom: -2,
      zoom: 0,
    });
    this.baseMap = this.renderImageOverlay(
      'http://leaflet.marsgis.cn/forleaflet/examples/crs-simple/uqm_map_full.png',
      [3467, 1165],
    );
    this.baseMap.addTo(this.Lmap);
    // eslint-disable-next-line global-require
    console.log(this.Lmap.getCenter());
    // eslint-disable-next-line global-require
    const marker = L.marker([582.5, 1733.5], { icon: this.myDivIcon({}, 'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190122/201901221049378519.png') });
    const marker2 = L.marker([500, 1733.5], { icon: this.myDivIcon({}, 'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190122/201901221049378519.png') });
    // this.baseMap.setUrl('http://hdwx.museum-edu.cn/uploadfiles/svgmap/20190416/201904161456235018.svg');
    marker.addTo(this.Lmap);
    marker2.addTo(this.Lmap);
    console.log(marker);
    marker.addEventListener('click', (e) => {
      console.log(e);
      console.log(marker.getElement().querySelector('.my-div-icon-marker'));
    });
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
    changeMap(url, callback) {
      this.removeLayer(true);
      if (this.baseMap) {
        this.baseMap.setUrl(url);
        // 设置中心点的变化为了解决谷歌浏览切换地址，不切换地图的问题
        // const center = this.Lmap.getCenter();
        // const [X, Y] = [center.lat, center.lng];
        // console.log(center);
        // this.Lmap = this.Lmap.setView([X - 10, Y - 10]);
        this.$nextTick(() => {
          const imageElemet = this.baseMap.getElement();
          console.log(imageElemet);
        });
      } else {
        this.baseMap = this.renderImageOverlay(url);
      }
      this.baseMap.addTo(this.Lmap);
      // 回调函数
      if (typeof callback === 'function') {
        callback();
      }
    },
    // 清除所有的marker和puope
    /*
    * all： {true, false},
    * 用来判断是否保留底图
    */
    removeLayer(all) {
      // 可以使用这个来清除所有的图层
      if (all) {
        this.Lmap.eachLayer((item) => {
          this.Lmap.removeLayer(item);
        });
        return this.Lmap;
      }
      this.Lmap.eachLayer((item) => {
        if (item !== this.baseMap) {
          this.Lmap.removeLayer(item);
        }
      });

      return this.Lmap;
    },
    // Marker图标的类
    myDefualtIcon(option = {}) {
      // 初始自带的一些选项
      // 因为在leafLet中全是px 所以要手动将rem => px
      const veiwSize = document.documentElement.offsetWidth;
      const designSize = 750;
      const baseFontSize = veiwSize / designSize * 100;
      const options = {
        // eslint-disable-next-line global-require
        shadowUrl: require('assets/marker-shadow.png'),
        iconSize: [0.3 * baseFontSize, 0.4 * baseFontSize],
        shadowSize: [0.20 * baseFontSize, 0.3 * baseFontSize],
        iconAnchor: [0.2 * baseFontSize, 0.4 * baseFontSize],
        shadowAnchor: [0.11 * baseFontSize, 0.27 * baseFontSize],
        popupAnchor: [-3, -76],
      };
      console.log(baseFontSize);
      Object.assign(options, option);
      return new L.Icon(options);
    },
    // Marker DivIcon
    myDivIcon(option = {}, iconsrc = '') {
      const options = {
        html: `<div class="my-div-icon-marker">
                  <img src="${iconsrc}">
              </div>`,
        bgPos: [0, 0],
      };
      Object.assign(options, option);
      return new L.DivIcon(options);
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
  /deep/ .my-div-icon-marker {
    position: absolute;
    margin-left: -48px;;
    margin-top: -116px;
    transform: scale(1);
    width: 120px;
    height: 140px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .leaflet-div-icon {
    background: transparent;
    border: none;
  }
}
</style>
