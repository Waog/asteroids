module Astroids {
    declare var astroids: any;

    export class Bullet extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('bullet', 'assets/player020.png');
        }

        private static UPDATE_ME_KEY_PREFIX: string = 'bulletUpdateMe';
        private static bulletCounter: number = 0;

        private static BULLET_SPEED: number = 400;
        private static BULLET_COOLDOWN: number = 50;

        private bulletReactivationTime: number = 0;
        private id: number = 0;


        constructor(game: Phaser.Game, x: number, y: number, rotation: number, private isLocal: boolean) {
            super(game, x, y, 'bullet');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.rotation = rotation;
            this.game.physics.arcade.velocityFromRotation(rotation,
                Bullet.BULLET_SPEED, this.body.velocity);
            this.lifespan = 2000;

            this.id = Bullet.bulletCounter++;

            if (!this.isLocal) {
                astroids.p2p.receiveText(Bullet.UPDATE_ME_KEY_PREFIX + this.id, this.onUpdateMe, this);
            }
        }

        update() {
            if (this.isLocal) {

                astroids.p2p.sendText(Bullet.UPDATE_ME_KEY_PREFIX + this.id,
                    this.x + ';' + this.y + ';');

                this.screenWrap();
            }
        }

        onUpdateMe(text: string) {
            console.log('bullet received ' + text);
            var messageArray = text.split(';');
            var messageX: number = +messageArray[0];
            var messageY: number = +messageArray[1];

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