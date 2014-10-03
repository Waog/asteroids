module Astroids {
    declare var astroids: any;

    export class Player extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('player', 'assets/player040.png');
        }

        private static UPDATE_ME_KEY = 'playerUpdateMe';

        leftKey: Phaser.Key;
        rightKey: Phaser.Key;

        constructor(game: Phaser.Game, x: number, y: number, private isLocal: boolean) {
            super(game, x, y, 'player');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);

            if (this.isLocal) {
                this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            } else {
                astroids.p2p.receiveText(Player.UPDATE_ME_KEY, this.onUpdateMe, this);
            }
        }

        update() {
            if (this.isLocal) {
                if (this.leftKey.isDown) {
                    this.angle -= 3;
                }
                else if (this.rightKey.isDown) {
                    this.angle += 3;
                }
                astroids.p2p.sendText(Player.UPDATE_ME_KEY, this.angle + ';');
            }
        }

        onUpdateMe(text: string) {
            console.log('player received ' + text);
            var messageArray = text.split(';');
            var messageAngle: number = +messageArray[0];

            this.angle = messageAngle;
        }
    }
}