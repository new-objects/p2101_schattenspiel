import Phaser from 'phaser';
import { HandTracking, webcamGui } from '@new-objects/libs';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this._handTracking = null;
  }

  preload() {
    const { width, height } = this.sys.game.canvas;
    this._width = width;
    this._height = height;

    this.load.image('bergwerk', 'assets/Berkwerk_Grundlage.jpg');
    this.load.image('lichter', 'assets/Berkwerk_Lichter.png');
  }

  create() {
    this.bergwerk = this.add.image(0, 0, 'bergwerk').setOrigin(0);
    this.bergwerk.setDisplaySize(this._width, this._height);
    this.lichter = this.add.image(0, 0, 'lichter').setOrigin(0);
    this.lichter.setDisplaySize(this._width, this._height);

    this.lichter.visible = false;

    HandTracking.initialize({
      hands: 2,
      width: this._width,
      height: this._height,
      webcamOptions: { video: { width: this._width, height: this._height } },
    }).then(tracker => {
      this._handTracking = tracker;

      // gui
      // !!! - (debug) - replaced it with my local variant
      webcamGui();
    });
  }

  update() {
    if (!this._handTracking) return;

    const results = this._handTracking.getHands(this._width, this._height);

    if (results.detected) {
      if (results.handLeft?.gesture === 'Closed_Fist') {
        this.lichter.visible = true;
      } else {
        this.lichter.visible = false;
      }

      if (results.handRight?.gesture === 'Closed_Fist') {
        this.lichter.visible = true;
      } else {
        this.lichter.visible = false;
      }
    }
  }
}
