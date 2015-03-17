module Astroids {
    declare var astroids: any;


    interface IUpdateMsg {
        x: number;
        y: number;
        rotation: number;
        body: IUpdateMsgBody;
        screenWrap: boolean;
    }

    interface IUpdateMsgBody {
        velocity: Phaser.Point;
    };

    export class Asteroid extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('asteroid', 'assets/asteroid2_052.png');
        }

        private static VELOCITY: number = 50;
        private static KILL_KEY_PREFIX: string = 'ASTEROID_KILL_KEY_';
        private static UPDATE_ME_KEY: string = 'asteroidUpdateMe';
        private static UPDATE_INTERVAL: number = 1 * Phaser.Timer.SECOND;
        private static DISCONNECT_TIMEOUT: number = Asteroid.UPDATE_INTERVAL * 2;

        private disconnectCountDown: number = Asteroid.DISCONNECT_TIMEOUT;

        private correctionUpdate: IUpdateMsg;
        private timeToApplyCorrectionUpdate: number;
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
                this.game.time.events.add(Asteroid.UPDATE_INTERVAL, this.updateRemote, this);
            } else {
                this.isLocal = false;
                this.tint = 0x8888FF;
            }
            astroids.p2p.receiveText(Asteroid.UPDATE_ME_KEY + this.remoteId, this.onUpdateMe, this, true);

            astroids.p2p.receiveText(Asteroid.KILL_KEY_PREFIX + this.remoteId, this.killWithoutResend, this, true);

        }

        getRemoteId(): string {
            return this.remoteId;
        }

        private updateRemote(screenWrap: boolean = false) {
            if (!screenWrap) {
                // propably it would be better to update at an interval instead
                this.game.time.events.add(Asteroid.UPDATE_INTERVAL, this.updateRemote, this);
            }

            this.updatePeer(screenWrap);
        }

        public updatePeer(screenWrap: boolean = false) {
            var msg: IUpdateMsg = {
                x: this.x,
                y: this.y,
                rotation: this.rotation,
                body: {
                    velocity: this.body.velocity
                },
                screenWrap: screenWrap
            }
            astroids.p2p.sendText(Asteroid.UPDATE_ME_KEY + this.remoteId, JSON.stringify(msg));
        }

        private onUpdateMe(text: string) {
            this.disconnectCountDown = Asteroid.DISCONNECT_TIMEOUT;

            var msg: IUpdateMsg = JSON.parse(text);


            this.body.velocity = msg.body.velocity;
            if (msg.screenWrap) {
                this.x = msg.x;
                this.y = msg.y;
                this.rotation = msg.rotation;
            } else {
                this.correctionUpdate = {
                    x: msg.x - this.x,
                    y: msg.y - this.y,
                    rotation: msg.rotation - this.rotation,
                    body: {
                        velocity: new Phaser.Point(0, 0)
                    },
                    screenWrap: false
                };
                this.timeToApplyCorrectionUpdate = Asteroid.UPDATE_INTERVAL;
            }
        }

        update() {
            if (this.isLocal) {
                this.screenWrap();
            } else {
                this.disconnectCountDown -= this.game.time.elapsed;
                if (this.disconnectCountDown <= 0) {
                    this.kill();
                }

                this.applyCorrectionUpdate();
            }
        }

        private applyCorrectionUpdate() {
            if (!this.correctionUpdate || this.timeToApplyCorrectionUpdate <= 0) {
                return;
            }

            var percentageToApply: number = this.game.time.elapsed / this.timeToApplyCorrectionUpdate;

            var deltaX = this.correctionUpdate.x * percentageToApply;
            this.x += deltaX;
            this.correctionUpdate.x -= deltaX;

            var deltaY = this.correctionUpdate.y * percentageToApply;
            this.y += deltaY;
            this.correctionUpdate.y -= deltaY;

            var deltaRotation = this.correctionUpdate.rotation * percentageToApply;
            this.rotation += deltaRotation;
            this.correctionUpdate.rotation -= deltaRotation;

            this.timeToApplyCorrectionUpdate -= this.game.time.elapsed;
        }

        private screenWrap() {

            if (this.x < 0) {
                this.x = this.game.width;
                this.updateRemote(true);
            }
            else if (this.x > this.game.width) {
                this.x = 0;
                this.updateRemote(true);
            }

            if (this.y < 0) {
                this.y = this.game.height;
                this.updateRemote(true);
            }
            else if (this.y > this.game.height) {
                this.y = 0;
                this.updateRemote(true);
            }
        }

        kill(): Phaser.Sprite {
            astroids.p2p.sendText(Asteroid.KILL_KEY_PREFIX + this.remoteId, 'noValue', true);
            return super.kill();
        }

        private killWithoutResend() {
            super.kill();
        }

        render() {
            this.game.debug.spriteInfo(this, 32, 32);
        }
    }
}