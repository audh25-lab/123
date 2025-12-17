import Phaser from 'phaser';
import MaleIslandScene from './scenes/MaleIslandScene';
import HulhumaleIslandScene from './scenes/HulhumaleIslandScene';
import AdduIslandScene from './scenes/AdduIslandScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [MaleIslandScene, HulhumaleIslandScene, AdduIslandScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000',
  audio: { disableWebAudio: false }
};

const game = new Phaser.Game(config);
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(console.error);
}
