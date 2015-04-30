import AsteroidFile = require('Asteroid');
import Asteroid = AsteroidFile.Asteroid;

declare var asteroids: any;

export class Bullet extends Phaser.Sprite {

    static preload(game: Phaser.Game) {
        game.load.image('bullet', 'assets/player020.png');
    }

    private static KILL_KEY_PREFIX: string = 'BULLET_KILL_KEY_';
    private static VELOCITY: number = 400;
    private static LIFESPAN: number = 500;

    private isLocal: boolean;

    constructor(game: Phaser.Game, x: number, y: number, rotation: number,
        private asteroidsGroup: Phaser.Group, private remoteId: string = null) {

        super(game, x, y, 'bullet');
        this.anchor.setTo(0.5, 0.5);
        game.add.existing(this);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.rotation = rotation;
        this.game.physics.arcade.velocityFromRotation(rotation,
            Bullet.VELOCITY, this.body.velocity);
        this.lifespan = Bullet.LIFESPAN;

        if (!this.remoteId) {
            this.isLocal = true;
            this.remoteId = "bullet_" + Math.random();
        } else {
            this.isLocal = false;
        }

        if (!this.isLocal) {
            this.tint = 0x8888FF;
            asteroids.p2p.receiveText(Bullet.KILL_KEY_PREFIX + this.remoteId, this.kill, this);
        }
    }

    getRemoteId(): string {
        return this.remoteId;
    }

    update() {
        if (this.isLocal) {
            this.game.physics.arcade.collide(this, this.asteroidsGroup, this.onAsteroidCollision, null, this);
        }

        this.screenWrap();
    }

    private onAsteroidCollision(thisLocalBullet: Bullet, asteroid: Asteroid) {
        asteroid.kill();
        asteroids.p2p.sendText(Bullet.KILL_KEY_PREFIX + this.remoteId, 'noValue');
        this.kill();
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
}
