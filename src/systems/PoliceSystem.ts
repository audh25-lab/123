import Phaser from 'phaser';

export default class PoliceSystem {
  private scene: Phaser.Scene;
  private units: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.units = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 20 });
  }

  updateHeat(heat: number, player: Phaser.Physics.Arcade.Sprite) {
    const level = Math.floor(heat / 20);
    for (let i = this.units.getLength(); i < level; i++) {
      const unit = this.units.getFirstDead(true, Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'police') as Phaser.Physics.Arcade.Sprite;
      if (unit) {
        unit.setData('hp', 100);
        this.scene.physics.moveToObject(unit, player, 200);
        this.scene.time.addEvent({ delay: 500, callback: () => {
          if (unit.active) {
            this.scene.physics.moveToObject(unit, player, 200);
            unit.anims.play('police-walk', true);
          }
        }, loop: true });
      }
    }

    if (heat < 5) {
      this.scene.time.delayedCall(10000, () => {
        this.units.getChildren().forEach(u => u.destroy());
      });
    }

    this.scene.physics.add.collider(this.units, player, () => {
      this.scene['playerStats'].hp -= 10;
      if (this.scene['playerStats'].hp <= 0) {
        this.scene.scene.pause();
      }
    });
  }
}