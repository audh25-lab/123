import PoliceSystem from './PoliceSystem';
import GangSystem from './GangSystem';
import Phaser from 'phaser';

export default class MBHSystem {
  private active = false;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  activate() { this.active = true; }
  overrideIfActive(police: PoliceSystem, gangs: GangSystem) {
    if (this.active) {
    }
  }
  isDefeated() { return false; }
}