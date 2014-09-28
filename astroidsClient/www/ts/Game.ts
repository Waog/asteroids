module Astroids {

    export class Game extends Phaser.Game {

        constructor() {
            super(1200, 500, Phaser.AUTO, 'astroids', null);

            this.state.add('Level1', Level1, false);
            this.state.start('Level1');
        }
    }

}