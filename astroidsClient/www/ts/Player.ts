module Astroids {
    declare var astroids: any;

    interface IKillMsg { }

    interface ICreateBulletMsg {
        x: number;
        y: number;
        rotation: number;
        remoteId: string;
    }

    interface IUpdateMsg {
        x: number;
        y: number;
        angle: number;
    }

    export class Player extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('player', 'assets/player040.png');
            Bullet.preload(game);
        }

        private static UPDATE_ME_KEY: string = 'playerUpdateMe';
        private static FIRE_BULLET_KEY: string = 'playerFireBullet';
        private static KILL_KEY: string = 'PLAYER_KILL_KEY';
        private static ROTATION_SPEED: number = 200;
        private static MAX_SPEED: number = 300;
        private static ACCELERATION: number = 300;
        private static DRAG: number = 300;
        private static BULLET_COOLDOWN: number = 100;
        private static DISCONNECT_TIMEOUT: number = 2000;

        private disconnectCountDown: number = Player.DISCONNECT_TIMEOUT;
        private bulletReactivationTime: number = 0;

        constructor(game: Phaser.Game, x: number, y: number, private isLocal: boolean,
            private asteroidsGroup: Phaser.Group) {

            super(game, x, y, 'player');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.drag.set(Player.DRAG);
            this.body.maxVelocity.set(Player.MAX_SPEED);


            if (!this.isLocal) {
                this.tint = 0x8888FF;
                astroids.p2p.receiveText(Player.KILL_KEY, this.kill, this);
                astroids.p2p.receiveText(Player.UPDATE_ME_KEY, this.onUpdateMe, this);
                astroids.p2p.receiveText(Player.FIRE_BULLET_KEY, this.onRemoteFireBullet, this);
            }
        }

        update() {
            if (this.isLocal) {

                this.game.physics.arcade.collide(this, this.asteroidsGroup, this.kill, null, this);

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

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.fireBullet();
                }

                var msg: IUpdateMsg = {
                    x: this.x,
                    y: this.y,
                    angle: this.angle
                }
                astroids.p2p.sendText(Player.UPDATE_ME_KEY, JSON.stringify(msg));

                this.screenWrap();
            } else {
                this.disconnectCountDown -= this.game.time.elapsed;
                if (this.disconnectCountDown <= 0) {
                    this.kill();
                }
            }
        }

        onUpdateMe(text: string) {
            // console.log('player received ' + text);
            this.disconnectCountDown = Player.DISCONNECT_TIMEOUT;

            var msg: IUpdateMsg = JSON.parse(text);

            this.x = msg.x;
            this.y = msg.y;
            this.angle = msg.angle;
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

        fireBullet() {
            if (this.game.time.now > this.bulletReactivationTime) {
                var x: number = this.body.x + this.width / 2;
                var y: number = this.body.y + this.height / 2;

                var bullet: Bullet = new Bullet(this.game, x, y, this.rotation,
                    this.asteroidsGroup);
                this.bulletReactivationTime = this.game.time.now + Player.BULLET_COOLDOWN;

                var msg: ICreateBulletMsg = {
                    x: x,
                    y: y,
                    rotation: this.rotation,
                    remoteId: bullet.getRemoteId()
                };

                astroids.p2p.sendText(Player.FIRE_BULLET_KEY, JSON.stringify(msg));
            }
        }

        onRemoteFireBullet(text: string) {
            // console.log('player received remoteFireBullet ' + text);
            var msg: ICreateBulletMsg = JSON.parse(text);
            var bullet: Bullet = new Bullet(this.game, msg.x, msg.y, msg.rotation,
                null, msg.remoteId);
        }

        kill(): Phaser.Sprite {
            if (this.isLocal) {
                astroids.p2p.sendText(Player.KILL_KEY, 'noValue');
            }
            return super.kill();
        }
    }
}