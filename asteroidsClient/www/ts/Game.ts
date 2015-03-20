module Asteroids {

    export class Game extends Phaser.Game {

        constructor() {
            super(421, 350, Phaser.AUTO, 'asteroids', null);

            this.state.add('Level1', Level1, false);
            this.state.start('Level1');
        }
    }

}