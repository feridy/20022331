<template>
  <div class="audio-container">
    <div class="audio-control" v-on:click="playAudio()">
      <span ref="playIcon" class="audio-control_icon iconfont icon-bofang1"></span>
    </div>
    <div class="audio-curtime">{{ audioCurrentTime }}</div>
    <div class="audio-progress" ref="audioProgressControl">
      <div class="audio-progress_btn" ref="audioProgressBtn"></div>
      <div class="audio-progress_cur" ref="audioProgressCur"></div>
    </div>
    <div class="audio-duration">{{audioDuration}}</div>
    <audio ref="audioElement" src="http://hdwx.museum-edu.cn/uploadfiles/exhibt/20190412/201904121333134226.mp3"></audio>
  </div>
</template>
<script>
export default {
  name: 'normal-audio',
  data() {
    return {
      audioDuration: this.duration,
      audioCurrentTime: '00:00',
    };
  },
  props: {
    duration: {
      type: Number,
    },
  },
  mounted() {
    const {
      audioElement, audioProgressBtn, audioProgressCur, audioProgressControl, playIcon,
    } = this.$refs;
    let currentX = 0;
    let moveX = 0;
    let btnLeft = 0;
    let progressWidth = 0;
    let durationTime = 0;
    audioElement.addEventListener('canplay', () => {
      console.log('audio can play');
      console.dir(audioElement);
      if (!this.audioDuration) {
        this.audioDuration = this.formatTime(audioElement.duration);
      }
      durationTime = audioElement.duration;
    });
    audioElement.addEventListener('timeupdate', () => {
      this.audioCurrentTime = this.formatTime(audioElement.currentTime);
      const audioProgress = audioElement.currentTime / audioElement.duration * 100;
      audioProgressBtn.style.left = `${audioProgress}%`;
      audioProgressCur.style.width = `${audioProgress}%`;
    });
    audioElement.addEventListener('ended', () => {
      console.log('aduio has end');
      audioProgressBtn.style.left = '100%';
      audioProgressCur.style.width = '100%';
    });
    audioProgressBtn.addEventListener('touchstart', (e) => {
      currentX = e.touches[0].clientX;
      btnLeft = audioProgressBtn.offsetLeft;
      progressWidth = audioProgressControl.offsetWidth;
      if (!audioElement.paused) {
        audioElement.pause();
        playIcon.classList.remove('icon-zanting1');
        playIcon.classList.add('icon-bofang1');
      }
      console.log(currentX);
    });
    audioProgressBtn.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].clientX - currentX;
      if (moveX + btnLeft >= progressWidth) {
        moveX = progressWidth;
      } else if (moveX + btnLeft <= 0) {
        moveX = 0;
      } else {
        moveX += btnLeft;
      }
      // audioProgressBtn.style.left = `${moveX / progressWidth * 100}%`;
      // audioProgressCur.style.width = `${moveX / progressWidth * 100}%`;
      audioElement.currentTime = moveX / progressWidth * durationTime;
      console.log(moveX);
    });
    audioProgressBtn.addEventListener('touchend', (e) => {
      if (audioElement.paused) {
        audioElement.play();
        playIcon.classList.remove('icon-bofang1');
        playIcon.classList.add('icon-zanting1');
      }
      console.log('touch end');
      console.log(e);
    });
    console.dir(audioProgressControl);
    console.log(progressWidth);
    console.log(btnLeft);
    console.log(durationTime);
  },
  methods: {
    playAudio() {
      const { audioElement, playIcon } = this.$refs;
      if (audioElement.paused) {
        audioElement.play();
        playIcon.classList.remove('icon-bofang1');
        playIcon.classList.add('icon-zanting1');
      } else {
        audioElement.pause();
        playIcon.classList.remove('icon-zanting1');
        playIcon.classList.add('icon-bofang1');
      }
    },
    formatTime(number) {
      const time = Math.ceil(number);
      const minutes = Math.floor(time / 60).toString().padStart(2, '0');
      const seconds = Math.ceil(time % 60).toString().padStart(2, '0');
      const strFormat = `${minutes}:${seconds}`;
      return strFormat;
    },
  },
};
</script>
<style lang="less" scoped>
.audio-container {
  display: flex;
  align-items: center;
  .audio-control {
    &_icon {
      font-size: 0.72rem;
      color: #DF5F2D;
    }
  }
  .audio-curtime {
    padding: 0 0.3rem;
  }
  .audio-progress {
    position: relative;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background-color: #BFBFBF;
    &_btn {
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translate(-50%, -50%);
      width: .2rem;
      height: .2rem;
      background-color: #DF5F2D;
      background-clip: content-box;
      border-radius: .2rem;
      border: .06rem solid rgba(223,95,45,0.5);
      z-index: 100;
    }
    &_cur {
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translate(0, -50%);
      width: 0%;
      height: 0.04rem;
      border-radius: 2px;
      background-color: #DF5F2D;
    }
  }
  .audio-duration {
    padding-left: 0.3rem;
  }
}
</style>
