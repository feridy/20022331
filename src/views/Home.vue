<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <img src="../assets/marker-icon-2x.png" alt="">
    <normal-audio></normal-audio>
    <circle-audio :audioSource="audioSource[0]"></circle-audio>
    <circle-audio :audioSource="audioSource[1]"></circle-audio>
    <circle-audio :audioSource="audioSource[2]"></circle-audio>
    <circle-audio :audioSource="audioSource[3]"></circle-audio>
    <circle-audio :audioSource="audioSource[4]"></circle-audio>

    <router-link to="/map">map</router-link>
  </div>
</template>

<script>
import { getExhibitionList } from 'api';
import NormalAudio from 'components/NormalAudio.vue';
import CircleAudio from 'components/CircleAudio.vue';

export default {
  name: 'home',
  created() {
    getExhibitionList().then((response) => {
      console.log(response);
    }).catch((error) => { console.log(error); });
  },
  data() {
    return {
      audioSource: [
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121333134226.mp3',
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121333362148.mp3',
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121333468390.mp3',
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121333599327.mp3',
        'http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121334259667.mp3',
      ],
    };
  },
  components: {
    NormalAudio,
    CircleAudio,
  },
};
</script>

<style lang="less">
  .home {
    > img {
      margin: 0 auto;
      width: 200px;
      height: auto;
    }
  }
</style>
