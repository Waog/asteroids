module Astroids {
    declare var astroids: any;

    export class Bullet extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('bullet', 'assets/player020.png');
        }

        private static VELOCITY: number = 400;
        private static LIFESPAN: number = 500;

        constructor(game: Phaser.Game, x: number, y: number, rotation: number) {
            super(game, x, y, 'bullet');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.rotation = rotation;
            this.game.physics.arcade.velocityFromRotation(rotation,
                Bullet.VELOCITY, this.body.velocity);
            this.lifespan = Bullet.LIFESPAN;
        }

        update() {
            this.screenWrap();
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