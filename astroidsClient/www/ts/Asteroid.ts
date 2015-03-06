module Astroids {
    declare var astroids: any;


    interface IUpdateMsg {
        x: number;
        y: number;
        rotation: number;
        skipTween: boolean;
    }

    export class Asteroid extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('asteroid', 'assets/asteroid2_052.png');
        }

        private static VELOCITY: number = 50;
        private static KILL_KEY_PREFIX: string = 'ASTEROID_KILL_KEY_';
        private static UPDATE_ME_KEY: string = 'asteroidUpdateMe';
        private static DISCONNECT_TIMEOUT: number = 3000;

        private disconnectCountDown: number = Asteroid.DISCONNECT_TIMEOUT;


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
        private updateRemote(skipTween: boolean = false) {
            console.log("updateRemote() called from Asteroid " + this);
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.updateRemote, this);

            var msg: IUpdateMsg = {
                x: this.x,
                y: this.y,
                rotation: this.rotation,
                skipTween: skipTween
            }
            astroids.p2p.sendText(Asteroid.UPDATE_ME_KEY, JSON.stringify(msg));
        }

        private onUpdateMe(text: string) {
            this.disconnectCountDown = Asteroid.DISCONNECT_TIMEOUT;

            var msg: IUpdateMsg = JSON.parse(text);

            var deltaX: number = msg.x - this.x;
            var deltaY: number = msg.y - this.y;
            var deltaRotation: number = msg.rotation - this.rotation;

            var signedDeltaX: string = (deltaX >= 0) ? "+" : "";
            signedDeltaX += deltaX;
            var signedDeltaY: string = (deltaY >= 0) ? "+" : "";
            signedDeltaY += deltaY;
            var signedDeltaRotation: string = (deltaRotation >= 0) ? "+" : "";
            signedDeltaRotation += deltaRotation;

            if (msg.skipTween) {
                this.x = msg.x;
                this.y = msg.y;
                this.rotation = msg.rotation;
            } else {
                this.game.add.tween(this).to({
                    x: signedDeltaX, y: signedDeltaY,
                    rotation: signedDeltaRotation
                }, 1000, Phaser.Easing.Linear.None, true);
            }

        }

        update() {
            this.screenWrap();
            //this.game.physics.arcade.velocityFromRotation(this.rotation,
            //  Asteroid.VELOCITY, this.body.velocity);

            if (!this.isLocal) {
                this.disconnectCountDown -= this.game.time.elapsed;
                if (this.disconnectCountDown <= 0) {
                    this.kill();
                }
            }
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

            this.updateRemote(true);
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