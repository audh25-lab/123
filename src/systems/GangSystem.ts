import Phaser from 'phaser';
import PressureSystem from './PressureSystem';
import ReputationSystem from './ReputationSystem';

interface Gang {
  id: string;
  tier: string;
  color: number;
  state: string;
  allies: string[];
  rivals: string[];
  boss: { alive: boolean; protection: number };
  footprint: number;
  members: Phaser.Physics.Arcade.Group;
}

export default class GangSystem {
  private gangs: Map<string, Gang> = new Map();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addGang(id: string, tier: string, color: number, allies: string[] = [], rivals: string[] = []) {
    const gang: Gang = {
      id, tier, color, state: 'Dormant',
      allies, rivals,
      boss: { alive: true, protection: 3 },
      footprint: 0,
      members: this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 50 })
    };
    this.gangs.set(id, gang);
  }

  evaluate(pressure: PressureSystem, reputation: ReputationSystem, isNight: boolean) {
    this.gangs.forEach(gang => {
      let totalPressure = 0;
      let count = 0;
      for (let y = 0; y < pressure['height']; y++) {
        for (let x = 0; x < pressure['width']; x++) {
          if (pressure['grid'][y][x].gangId === gang.id) {
            totalPressure += pressure['grid'][y][x].value;
            count++;
          }
        }
      }
      const avgPressure = count > 0 ? totalPressure / count : 0;
      gang.footprint = count;

      if (avgPressure > 70 || reputation.get() > 50) gang.state = 'Hostile';
      else if (avgPressure > 50) gang.state = 'Desperate';
      else if (avgPressure > 30) gang.state = 'Defensive';
      else if (isNight) gang.state = 'Assertive';
      else gang.state = 'Dormant';

      if (gang.state === 'Hostile' && Math.random() < 0.1 * (isNight ? 2 : 1)) {
        const member = gang.members.getFirstDead(true, Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'gang_member') as Phaser.Physics.Arcade.Sprite;
        if (member) {
          member.setTint(gang.color);
          member.setData('hp', 50);
          this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
              if (member.active) {
                this.scene.physics.moveToObject(member, this.scene['player'], 100);
                member.anims.play('gang-walk', true);
              }
            },
            loop: true
          });
        }
      }

      this.gangs.forEach(otherGang => {
        if (gang.rivals.includes(otherGang.id) && Math.random() < 0.05) {
          this.scene.physics.add.collider(gang.members, otherGang.members, this.fightHandler, undefined, this);
        }
      });

      if (gang.state !== 'Dormant' && pressure['grid'][Math.floor(this.scene['player'].y / pressure['tileSize'])][Math.floor(this.scene['player'].x / pressure['tileSize'])].gangId === gang.id) {
        if (Math.random() < 0.2) {
          const defender = gang.members.getFirstDead(true, this.scene['player'].x + Phaser.Math.Between(-200, 200), this.scene['player'].y + Phaser.Math.Between(-200, 200), 'gang_member');
          if (defender) {
            defender.setTint(gang.color);
            defender.setData('hp', 50);
            this.scene.physics.moveToObject(defender, this.scene['player'], 150);
            defender.anims.play('gang-walk', true);
          }
        }
      }
    });
  }

  private fightHandler(a: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
    const aSprite = a as Phaser.Physics.Arcade.Sprite;
    const bSprite = b as Phaser.Physics.Arcade.Sprite;
    aSprite.setData('hp', (aSprite.getData('hp') || 50) - 10);
    if (aSprite.getData('hp') <= 0) {
      aSprite.destroy();
      this.scene.sound.play('explosion');
      this.scene.cameras.main.shake(200, 0.02);
    }
    bSprite.setData('hp', (bSprite.getData('hp') || 50) - 10);
    if (bSprite.getData('hp') <= 0) {
      bSprite.destroy();
      this.scene.sound.play('explosion');
      this.scene.cameras.main.shake(200, 0.02);
    }
  }
}