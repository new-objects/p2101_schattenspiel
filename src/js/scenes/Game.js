import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('bergwerk', 'assets/Berkwerk_Grundlage.jpg');
    this.load.image('lichter', 'assets/Berkwerk_Lichter.png');
  }

  create() {
    this.bergwerk = this.add.image(0, 0, 'bergwerk').setOrigin(0);

    this.lichter = this.add.image(0, 0, 'lichter').setOrigin(0);
    this.lichter.visible = false;
  }
}
