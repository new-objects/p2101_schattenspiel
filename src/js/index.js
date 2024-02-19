import '../css/style.css';

import Phaser from 'phaser';
import Game from './scenes/Game';

export default new Phaser.Game({
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    width: 1280,
    height: 720,
  },
  scene: [Game],
});
