<template>
  <div class="map-container">
    <my-map></my-map>
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
