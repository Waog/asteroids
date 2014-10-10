module Astroids {
    declare var astroids: any;

    export class Asteroid extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('asteroid', 'assets/asteroid2_052.png');
        }

        private static VELOCITY: number = 50;
        private static KILL_KEY_PREFIX: string = 'ASTEROID_KILL_KEY_';


        private isLocal: boolean;

        constructor(game: Phaser.Game, x: number, y: number, rotation: number,
            asteroidsGroup: Phaser.Group, private remoteId: string = null) {

            super(game, x, y, 'asteroid');
            this.anchor.setTo(0.5, 0.5);
            asteroidsGroup.add(this);
            this.rotation = rotation;
            this.game.physics.arcade.velocityFromRotation(rotation,
                Asteroid.VELOCITY, this.body.velocity);

            if (!this.remoteId) {
                this.isLocal = true;
                this.remoteId = "asteroid_" + Math.random();
            } else {
                this.isLocal = false;
            }

            if (!this.isLocal) {
                astroids.p2p.receiveText(Asteroid.KILL_KEY_PREFIX + this.remoteId, this.killWithoutResend, this, true);
            }

        }

        getRemoteId(): string {
            return this.remoteId;
        }

        update() {
            this.screenWrap();
        }

        private screenWrap() {
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

        kill(): Phaser.Sprite {
            astroids.p2p.sendText(Asteroid.KILL_KEY_PREFIX + this.remoteId, 'noValue', true);
            return super.kill();
        }

        private killWithoutResend() {
            super.kill();
        }
    }
}