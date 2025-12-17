import Phaser from 'phaser';

export default class DayNightSystem {
  public isNight = false;
  constructor(scene: Phaser.Scene) {
    scene.time.addEvent({ delay: 300000, callback: () => this.isNight = !this.isNight, loop: true });
  }
}