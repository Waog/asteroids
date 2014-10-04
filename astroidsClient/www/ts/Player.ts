module Astroids {
    declare var astroids: any;

    export class Player extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('player', 'assets/player040.png');
        }

        private static UPDATE_ME_KEY: string = 'playerUpdateMe';

        private static ROTATION_SPEED: number = 200;
        private static MAX_SPEED: number = 300;
        private static ACCELERATION: number = 300;

        constructor(game: Phaser.Game, x: number, y: number, private isLocal: boolean) {
            super(game, x, y, 'player');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.drag.set(300);
            this.body.maxVelocity.set(Player.MAX_SPEED);

            if (!this.isLocal) {
                astroids.p2p.receiveText(Player.UPDATE_ME_KEY, this.onUpdateMe, this);
            }
        }

        update() {
            if (this.isLocal) {

                this.body.angularVelocity = 0;
                this.body.acceleration.set(0);

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.angularVelocity = -Player.ROTATION_SPEED;
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.angularVelocity = Player.ROTATION_SPEED;
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.game.physics.arcade.accelerationFromRotation(this.rotation,
                        Player.ACCELERATION, this.body.acceleration);
                }
                astroids.p2p.sendText(Player.UPDATE_ME_KEY, this.angle + ';' + this.x + ';' + this.y + ';');
                
                this.screenWrap();
            }
        }

        onUpdateMe(text: string) {
            console.log('player received ' + text);
            var messageArray = text.split(';');
            var messageRotation: number = +messageArray[0];
            var messageX: number = +messageArray[1];
            var messageY: number = +messageArray[2];

            this.angle = messageRotation;
            this.x = messageX;
            this.y = messageY;
        }

        screenWrap() {
            if (this.x < 0) {
                this.x = this.game.width;
            }
            else if (this.x > this.game.width) {
                this.x = 0;
            }

            if (this.y < 0) {
                this.y = this.game.height;
            }
            else if (this.y > this.game.height) {
                this.y = 0;
            }
        }
    }
}