<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    // console.log(this.$route);
  },
};
</script>

<style lang="less">
#app {
  font-family: sans-serif, "Avenir", Helvetica, Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 0.32rem;
  line-height: 1.5;
  text-align: center;
  // img {
  //   margin: 0 auto;
  //   width: 2rem;
  //   height: auto;
  // }
}
</style>
