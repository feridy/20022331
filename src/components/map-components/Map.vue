<template>
  <div ref="map">
    this is a map;
  </div>
</template>

<script>
import L from 'leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';

export default {
  created() {
    console.log(L);
  },
};
</script>
