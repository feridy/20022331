<template>
  <div class="map-container">
    <my-map></my-map>
    <button v-on:click="getMap(0)">获取地图按键</button>
  </div>
</template>

<script>
import MyMap from 'components/map-components/Map.vue';
import { getMapList } from 'api';

export default {
  components: {
    MyMap,
  },
  methods: {
    getMap(floorId) {
      getMapList({ floor_id: floorId }).then((res) => {
        console.log(res);
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>
