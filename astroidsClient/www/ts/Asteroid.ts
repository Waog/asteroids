module Astroids {
    declare var astroids: any;


    interface IUpdateMsg {
        x: number;
        y: number;
        rotation: number;
    }

    export class Asteroid extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('asteroid', 'assets/asteroid2_052.png');
        }

        private static VELOCITY: number = 50;
        private static KILL_KEY_PREFIX: string = 'ASTEROID_KILL_KEY_';
        private static UPDATE_ME_KEY: string = 'asteroidUpdateMe';



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
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.updateRemote, this);
            } else {
                this.isLocal = false;
                this.tint = 0x8888FF;
                astroids.p2p.receiveText(Asteroid.UPDATE_ME_KEY, this.onUpdateMe, this);
            }

            astroids.p2p.receiveText(Asteroid.KILL_KEY_PREFIX + this.remoteId, this.killWithoutResend, this, true);

        }

        getRemoteId(): string {
            return this.remoteId;
        }
        private updateRemote() {
            console.log("updateRemote() called from Asteroid " + this);
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.updateRemote, this);

            var msg: IUpdateMsg = {
                x: this.x,
                y: this.y,
                rotation: this.rotation
            }
            astroids.p2p.sendText(Asteroid.UPDATE_ME_KEY, JSON.stringify(msg));
        }

        private onUpdateMe(text: string) {

            var msg: IUpdateMsg = JSON.parse(text);

            this.x = msg.x;
            this.y = msg.y;
            this.rotation = msg.rotation;

            this.game.physics.arcade.velocityFromRotation(this.rotation,
                Asteroid.VELOCITY, this.body.velocity);
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