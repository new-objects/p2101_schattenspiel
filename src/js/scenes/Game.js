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

    this.load.image('bergwerk', 'assets/Berkwerk_unbeleuchtet.jpg');
    this.load.image('bergwerk_overlay', 'assets/Bergwerk_overlay.png');

    for (let i = 1; i <= 6; i++) {
      this.load.image(`lichter${i}`, `assets/Licht${i}.jpeg`);
    }
  }

  create() {
    this.bergwerk = this.add.image(0, 0, 'bergwerk').setOrigin(0);
    this.bergwerk.setDisplaySize(this._width, this._height);

    for (let i = 1; i <= 6; i++) {
      const lichter = this.add.image(0, 0, `lichter${i}`).setOrigin(0);
      lichter.setDisplaySize(this._width, this._height);
      lichter.setBlendMode(Phaser.BlendModes.SCREEN);
      lichter.visible = false;
      lichter.name = `lichter${i}`;

      this[`lichter${i}`] = lichter;
    }

    this.bergwerkOverlay = this.add
      .image(0, 0, 'bergwerk_overlay')
      .setOrigin(0);
    this.bergwerkOverlay.setDisplaySize(this._width, this._height);
    this.bergwerkOverlay.setBlendMode(Phaser.BlendModes.OVERLAY);

    HandTracking.initialize({
      hands: 2,
      width: this._width,
      height: this._height,
      webcamOptions: { video: { width: this._width, height: this._height } },
    }).then(tracker => {
      this._handTracking = tracker;

      // gui
      webcamGui();
    });
  }

  update() {
    if (!this._handTracking) return;

    const results = this._handTracking.getHands(this._width, this._height);

    if (results.detected) {
      this.setAllHandsInvisible();

      if (results.handLeft?.gesture === 'Closed_Fist') {
        const closest = this.selectClosestLichtGroup(results.handLeft);
        closest.visible = true;
      }

      if (results.handRight?.gesture === 'Closed_Fist') {
        const closest = this.selectClosestLichtGroup(results.handRight);
        closest.visible = true;
      }
    }
  }

  setAllHandsInvisible() {
    for (let i = 1; i <= 6; i++) {
      this[`lichter${i}`].visible = false;
    }
  }

  selectClosestLichtGroup(hand) {
    if (!hand) throw new Error(`No hand detected.`);

    let closestLicht = null;
    let _closestDist = Number.POSITIVE_INFINITY;

    for (let i = 1; i <= 2; i++) {
      const y = this._height * i * (1 / 2);
      for (let j = 1; j <= 3; j++) {
        const x = this._width * j * (1 / 3);
        const _dist = Phaser.Math.Distance.Between(hand.x, hand.y, x, y);
        if (_dist < _closestDist) {
          closestLicht = this[`lichter${i * j}`];
          _closestDist = _dist;
        }
      }
    }
    console.log(closestLicht);
    return closestLicht;
  }
}
