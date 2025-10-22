<!--
  3D 旋转相册组件
  功能：展示 3D 旋转图片效果，配有背景音乐和动画心形
  作者：zhangjinxi
-->
<template>
  <div id="app">
    <div class="container">
      <!-- 3D 旋转图片容器 -->
      <div class="images">
        <img
          v-for="item in imageCount"
          :key="item"
          :src="getImage(item)"
          :alt="`相册图片 ${item}`"
        />
      </div>

      <!-- 动画心形 -->
      <div class="heart" aria-hidden="true"></div>

      <!-- 背景音乐 -->
      <audio
        :src="music"
        autoplay="autoplay"
        controls="controls"
        loop="loop"
        class="audio-player"
        aria-label="背景音乐播放器"
      >
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
  </div>
</template>

<script>
/**
 * 3D 旋转相册组件
 */
export default {
  name: 'MusicAlbum',

  data() {
    return {
      // 背景音乐路径
      music: require('../public/music/aaa.mp3'),
      
      // 图片数量（8 张图片组成八边形）
      imageCount: 8
    };
  },

  methods: {
    /**
     * 获取指定序号的图片路径
     * @param {number} index - 图片序号（1-8）
     * @returns {string} 图片路径
     */
    getImage(index) {
      return require(`../public/images/pictrue (${index}).jpg`);
    }
  }
};
</script>

<style scoped>
/* ===== 全局重置 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== 容器样式 ===== */
.container {
  width: 100vw;
  height: 100vh;
  background-image: url('../public/images/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top: 1px solid #ffffff;
  position: relative;
  overflow: hidden;
}

/* ===== 音频播放器 ===== */
.audio-player {
  position: absolute;
  bottom: 10px;
  right: 0;
  z-index: 100;
}

/* ===== 动画心形 ===== */
.heart {
  position: absolute;
  left: 0;
  top: 50%;
  width: 5rem;
  height: 5rem;
  background-image: url('../public/images/heart.webp');
  background-size: cover;
  background-repeat: no-repeat;
  animation: move 6s linear 0.1s infinite;
  z-index: 10;
}

/* ===== 3D 图片容器 ===== */
.images {
  position: relative;
  top: 20rem;
  width: 20rem;
  height: 28rem;
  margin: 8% auto;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: rotateX(-8deg) rotateY(0deg);
  animation: around 10s linear 0.1s infinite;
}

/* ===== 图片样式 ===== */
.images img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* ===== 八边形布局（每张图片旋转 45 度） ===== */
.images img:nth-child(1) {
  transform: rotateY(0deg) translateZ(28rem);
}

.images img:nth-child(2) {
  transform: rotateY(45deg) translateZ(28rem);
}

.images img:nth-child(3) {
  transform: rotateY(90deg) translateZ(28rem);
}

.images img:nth-child(4) {
  transform: rotateY(135deg) translateZ(28rem);
}

.images img:nth-child(5) {
  transform: rotateY(180deg) translateZ(28rem);
}

.images img:nth-child(6) {
  transform: rotateY(225deg) translateZ(28rem);
}

.images img:nth-child(7) {
  transform: rotateY(270deg) translateZ(28rem);
}

.images img:nth-child(8) {
  transform: rotateY(315deg) translateZ(28rem);
}

/* ===== 动画效果 ===== */

/**
 * 3D 旋转动画
 * 0%   -> 100%: 完整旋转 360 度
 * 25%  -> 90 度时 X 轴回正
 * 50%  -> 180 度时 X 轴向前倾
 * 75%  -> 270 度时 X 轴回正
 */
@keyframes around {
  0% {
    transform: rotateX(-8deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(0deg) rotateY(90deg);
  }
  50% {
    transform: rotateX(8deg) rotateY(180deg);
  }
  75% {
    transform: rotateX(0deg) rotateY(270deg);
  }
  100% {
    transform: rotateX(-8deg) rotateY(360deg);
  }
}

/**
 * 心形移动动画
 * 沿着屏幕边缘移动形成心形轨迹
 */
@keyframes move {
  0% {
    left: 0;
    top: 50%;
  }
  25% {
    left: 25%;
    top: 0;
  }
  50% {
    left: 50%;
    top: 50%;
  }
  75% {
    left: 75%;
    top: 100%;
  }
  100% {
    left: 100%;
    top: 50%;
  }
}

/* ===== 响应式适配 ===== */
@media (max-width: 768px) {
  .images {
    width: 15rem;
    height: 21rem;
    top: 10rem;
  }

  .images img:nth-child(n) {
    transform: rotateY(calc((var(--n) - 1) * 45deg)) translateZ(21rem);
  }

  .heart {
    width: 3rem;
    height: 3rem;
  }

  .audio-player {
    width: 80%;
    right: 10%;
  }
}

@media (max-width: 480px) {
  .images {
    width: 12rem;
    height: 16rem;
    top: 8rem;
  }

  .heart {
    width: 2rem;
    height: 2rem;
  }
}
</style>