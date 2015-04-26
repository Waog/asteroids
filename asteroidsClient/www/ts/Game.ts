/// <reference path="./phaser.d.ts"/>

import Level1File = require('Level1');
import Level1 = Level1File.Level1;

export class Game extends Phaser.Game {

    constructor() {
        super(421, 350, Phaser.AUTO, 'asteroids', null);

        this.state.add('Level1', Level1, false);
        this.state.start('Level1');
    }
}

