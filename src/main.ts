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
  audio: { disableWebAudio: false },
  pipeline: { 'Tint': Phaser.Renderer.WebGL.Pipelines.TintPipeline } 
};

const game = new Phaser.Game(config);
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(console.error);
}

// Load save on game start
game.events.on('ready', () => {
  const save = localStorage.getItem('rva-save');
  if (save) {
    const data = JSON.parse(save);
    game.scene.start(data.island);
    const scene = game.scene.getScene(data.island);
    scene.events.on('create', () => {
      scene['playerStats'].hp = data.hp;
      scene['playerStats'].cash = data.cash;
      scene['playerStats'].ammo = data.ammo;
      scene['playerStats'].heat = data.heat;
      scene['reputation'].load(data.reputation);
    });
  }
});