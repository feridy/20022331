/* eslint-disable no-underscore-dangle */
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
      // mapCurrentZoom: 0, // 地图初始的缩放等级，用来控制marker的缩放
      // imageZoom: 1,
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
    const marker = this.myMarker([900, 400], {
      iconUrl:
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190122/201901221049378519.png',
    });
    const marker2 = L.marker([500, 1733.5], {
      icon: this.myDivIcon(
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190122/201901221049378519.png',
      ),
    });
    // this.baseMap.setUrl('http://hdwx.museum-edu.cn/uploadfiles/svgmap/20190416/201904161456235018.svg');
    marker.addTo(this.Lmap);
    marker2.addTo(this.Lmap);
    console.log(marker);
    marker2.addEventListener('click', () => {
      // eslint-disable-next-line no-underscore-dangle
      marker2._popup.openPopup();
      console.log(marker2);
    });

    const popup = this.mypopup();
    marker2.bindPopup(popup);
    // 获取zoom, market和地图一起缩放，有一定的比值来进行缩放
    // this.mapCurrentZoom = this.Lmap.getZoom();
    this.Lmap.addEventListener('zoom', () => {
      //   const zoom = this.Lmap.getZoom();
      //   this.Lmap.eachLayer((item) => {
      //     console.log(this.Lmap.getBounds());
      //     if (item.dragging) {
      //       // eslint-disable-next-line no-underscore-dangle
      //       const iconElement = item._icon;
      //       console.log(zoom);
      //       // imageZoom 0 - 2;
      //       if (this.Lmap.getMinZoom() === zoom) {
      //         this.imageZoom = 1;
      //       } else if (this.mapCurrentZoom - zoom > 0) {
      //         this.imageZoom -= 0.1;
      //       } else {
      //         this.imageZoom += 0.5;
      //       }
      //       // 针对默认的图标
      //       if (iconElement.nodeName === 'IMG') {
      //         const { transform } = iconElement.style;
      //         iconElement.style.transform = `${transform} scale(${this.imageZoom})`;
      //       } else {
      //         iconElement.firstChild.style.transform = `scale(${this.imageZoom})`;
      //       }
      //       this.mapCurrentZoom = zoom;
      //       console.dir(iconElement);
      //     }
      //   });
      // });
      // this.Lmap.eachLayer((item) => {
      //   console.log(item);
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
        // zoomSnap: 0.5,
        // zoomDelta: 0.5,
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
      if (this.Lmap.hasLayer(this.baseMap)) {
        this.Lmap.removeLayer(this.baseMap);
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
    removeLayer(all = true) {
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
      const baseFontSize = (veiwSize / designSize) * 100;
      const options = {
        // eslint-disable-next-line global-require
        iconUrl: require('assets/marker-icon-2x.png'),
        // eslint-disable-next-line global-require
        shadowUrl: require('assets/marker-shadow.png'),
        iconSize: [0.4 * baseFontSize, 0.6 * baseFontSize],
        shadowSize: [0.3 * baseFontSize, 0.4 * baseFontSize],
        iconAnchor: [0.2 * baseFontSize, 0.4 * baseFontSize],
        shadowAnchor: [0.11 * baseFontSize, 0.27 * baseFontSize],
        popupAnchor: [-3, -76],
      };
      Object.assign(options, option);
      return new L.Icon(options);
    },
    // Marker DivIcon
    myDivIcon(iconsrc = '', option = {}) {
      const options = {
        html: `<div class="my-div-icon-marker">
                  <img src="${iconsrc}">
              </div>`,
        bgPos: [0, 0],
      };
      Object.assign(options, option);
      const divIcon = new L.DivIcon(options);
      return divIcon;
    },
    // 封装地图的marker方法
    /*
    * option: {
      divOption: {
        html: ""
      },
      defualtOption: {
        defualtIcon
      }
    }
    * point 为marker的点位为[x, y]的形式
    */
    myMarker(point, iconImage = '', option = {}) {
      let icon = {};
      if (iconImage && !(iconImage instanceof Object)) {
        icon = this.myDivIcon(iconImage, option);
      } else {
        icon = this.myDefualtIcon(iconImage || option);
      }
      const points = this.transformxyToyx(point);
      const marker = L.marker(points, { icon });
      return marker;
    },
    // popup 方法
    mypopup(name = '', image = '', content = '', id = 0, option = {}) {
      const options = {
        offset: [0, -40],
        className: 'popup-wapper',
        // maxWidth: 1400,
      };
      Object.assign(options, option);
      const popup = L.popup(options);
      const popupContent = `<div class='popup-container'>
                                  <h3 class='popup-title'>${name}</h3>
                                  <div class='popup-content'>
                                    <img src='${image}'>
                                    <div class='popup-right'>
                                      <p>${content}</p>
                                      <div class='popup-btn'>
                                        <div class='audio-play'>
                                          <span class='iconfont icon-ziyuanldpi'></span>
                                          <span>暂停</span>
                                        </div>
                                        <a href='#/guide/audio_detail/${id}'>
                                          <span class='iconfont .icon-tuwenxiangqing'></span>
                                          <span>详情</span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                             </div>`;
      popup.setContent(popupContent);

      return popup;
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
    // height: 800px;
    height: 100vh;
    background-color: aqua;
  }
  /deep/ .my-div-icon-marker {
    position: absolute;
    margin-left: -48px;
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
  /deep/ .popup-wapper {
    width: 580px;
    height: 280px;
  }
  /deep/ .popup-container {
    width: 540px;
    height: 280px;
    padding: 20px;
    .popup-title {
      font-weight: 500;
      font-size: 28px;
      color: #301a0d;
    }
    .popup-content {
      margin-top: 20px;
      display: flex;
      flex-flow: row nowrap;
      img {
        width: 170px;
        height: 170px;
      }
      .popup-right {
        box-sizing: border-box;
        width: calc(100% - 130px);
        padding-left: 20px;
        font-size: 24px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        p {
          padding: 0;
          margin: 0;
          line-height: 1.25;
        }
        .popup-btn {
          display: flex;
          justify-content: space-between;
          div,
          a {
            // display: block;
            width: 120px;
            height: 48px;
            border-radius: 30px;
            background-color: #d49630;
            position: relative;
            span {
              display: inline-block;
              color: #fff;
              line-height: 48px;
              &:first-child {
                position: absolute;
                top: 50%;
                left: 16px;
                margin-top: -16px;
                width: 32px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                font-size: 28px;
                // background-color: #261710;
              }
              &:last-child {
                margin-left: 28px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
