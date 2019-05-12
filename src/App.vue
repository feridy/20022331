/* eslint-disable import/extensions */
<template>
  <div id="app">
    <h1>这是一个检查适配效果的内容</h1>
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <hello-world></hello-world> -->
    <normal-audio></normal-audio>
    <circle-audio :audioSource="audioSource[0]"></circle-audio>
    <circle-audio :audioSource="audioSource[1]"></circle-audio>
    <circle-audio :audioSource="audioSource[2]"></circle-audio>
    <circle-audio :audioSource="audioSource[3]"></circle-audio>
    <circle-audio :audioSource="audioSource[4]"></circle-audio>
    <!-- spinner -->
    <div class="looping-rhombuses-spinner">
      <div class="rhombus"></div>
      <div class="rhombus"></div>
      <div class="rhombus"></div>
    </div>
  </div>


</template>

<script>
import { getExhibitionList } from 'api';
import NormalAudio from './components/NormalAudio.vue';
import CircleAudio from './components/CircleAudio.vue';

export default {
  name: 'app',
  mounted() {
    this.audioObj = this.$refs.audioObj;
  },
  data() {
    return {
      audioObj: null,
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
    // HelloWorld,
    NormalAudio,
    CircleAudio,
  },
  created() {
    getExhibitionList().then((response) => {
      console.log(response);
    }).catch((error) => { console.log(error); });
  },
  methods: {
    sendAudio(audio) {
      console.log(audio);
    },
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
  img {
    margin: 0 auto;
    width: 2rem;
    height: auto;
  }
  h1 {
    width: 100%;
    height: 40px;
    font-size: 32px;
    font-weight: 500;
    text-align: center;
    line-height: 40px;
  }
  //spinner
  .looping-rhombuses-spinner,
  .looping-rhombuses-spinner * {
    box-sizing: border-box;
  }

  .looping-rhombuses-spinner {
    width: calc(15px * 4);
    height: 15px;
    position: relative;
  }

  .looping-rhombuses-spinner .rhombus {
    height: 15px;
    width: 15px;
    background-color: #ff1d5e;
    left: calc(15px * 4);
    position: absolute;
    margin: 0 auto;
    border-radius: 50%;
    transform: translateY(0) scale(0);
    animation: looping-rhombuses-spinner-animation 2500ms linear infinite;
  }

  .looping-rhombuses-spinner .rhombus:nth-child(1) {
    animation-delay: calc(2500ms * 1 / -1.5);
  }

  .looping-rhombuses-spinner .rhombus:nth-child(2) {
    animation-delay: calc(2500ms * 2 / -1.5);
  }

  .looping-rhombuses-spinner .rhombus:nth-child(3) {
    animation-delay: calc(2500ms * 3 / -1.5);
  }

  @keyframes looping-rhombuses-spinner-animation {
    0% {
      transform: translateX(0) rotate(45deg) scale(0);
    }
    50% {
      transform: translateX(-233%) rotate(45deg) scale(1);
    }
    100% {
      transform: translateX(-466%) rotate(45deg) scale(0);
    }
  }
}
</style>
