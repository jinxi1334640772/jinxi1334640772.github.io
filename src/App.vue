<template>
    <div id="app">
        <div class="container">
            <div class="images">
                <img :src="getImage(1)" alt="pic1">
                <img :src="getImage(2)" alt="pic1">
                <img :src="getImage(3)" alt="pic1">
                <img :src="getImage(4)" alt="pic1">
                <img :src="getImage(5)" alt="pic1">
                <img :src="getImage(6)" alt="pic1">
                <img :src="getImage(7)" alt="pic1">
                <img :src="getImage(8)" alt="pic1">
            </div>
            <div class="heart"></div>
            <audio :src="music" autoplay="autoplay" controls="controls" loop="loop" style="bottom: 10px;left: 0px;position: absolute;"></audio>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            music: require('../public/music/周笔畅 - 去流浪.mp3')
        }
    },
    methods: {
        getImage(val) {
            return require(`../public/images/1 (${val}).jpg`);
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
.container {
    width: 100vw;
    height: 100vh;
    background-image: url("../public/images/background.jpg");
    background-repeat: no-repeat;
    border-top: 1px solid white;
    background-size: 100% 100%;
}
.heart {
    background-image: url("../public/images/heart.webp");
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: 50%;
    animation: move 6s linear 0.1s infinite normal;
    z-index: 10;
    width: 100px;
    height: 100px;
}
.images {
    position: relative;
    width: 300px;
    height: 400px;
    transform-style: preserve-3d;
    perspective: 0;
    transform: rotateX(-8deg) rotateY(0deg);
    animation: around 10s linear 0.1s infinite normal;
    margin: 8% auto;
}
.images img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
}
.images img:nth-child(1) {
    transform: rotateX(0deg) rotateY(0deg) translateZ(400px);
}
.images img:nth-child(2) {
    transform: rotateX(0deg) rotateY(45deg) translateZ(400px);
}
.images img:nth-child(3) {
    transform: rotateX(0deg) rotateY(90deg) translateZ(400px);
}
.images img:nth-child(4) {
    transform: rotateX(0deg) rotateY(135deg) translateZ(400px);
}
.images img:nth-child(5) {
    transform: rotateX(0deg) rotateY(180deg) translateZ(400px);
}
.images img:nth-child(6) {
    transform: rotateX(0deg) rotateY(225deg) translateZ(400px);
}
.images img:nth-child(7) {
    transform: rotateX(0deg) rotateY(270deg) translateZ(400px);
}
.images img:nth-child(8) {
    transform: rotateX(0deg) rotateY(315deg) translateZ(400px);
}
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
@keyframes move {
    0% {
        left: 0;
        top: 50%;
    }
    25% {
        left: 25%;
        top: 0;
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
</style>
