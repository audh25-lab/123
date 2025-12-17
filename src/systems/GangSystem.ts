import Phaser from 'phaser';

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

  addGang(id: string, tier: string, color: number) {
    const gang: Gang = {
      id, tier, color, state: 'Dormant',
      allies: [], rivals: [],
      boss: { alive: true, protection: 3 },
      footprint: 0,
      members: this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 50 })
    };
    this.gangs.set(id, gang);
  }

  evaluate(pressure: PressureSystem, reputation: ReputationSystem, isNight: boolean) {
    this.gangs.forEach(gang => {
      const avgPressure = 50;
      if (avgPressure > 70 || reputation.get() > 50) gang.state = 'Hostile';
      else if (isNight) gang.state = 'Assertive';

      if (gang.state === 'Hostile' && Math.random() < 0.1) {
        const member = gang.members.get(0, 0, 'gang_member') as Phaser.Physics.Arcade.Sprite;
        if (member) {
          member.setActive(true).setVisible(true).setTint(gang.color);
        }
      }

      this.gangs.forEach(otherGang => {
        if (gang.rivals.includes(otherGang.id)) {
          this.scene.physics.add.collider(gang.members, otherGang.members, this.fightHandler);
        }
      });
    });
  }

  private fightHandler(a: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
    (a as Phaser.Physics.Arcade.Sprite).setData('hp', (a.getData('hp') || 50) - 10);
    if (a.getData('hp') <= 0) a.destroy();
  }
}