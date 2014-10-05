module Astroids {
    declare var astroids: any;

    interface ICreateAsteroidMsg {
        x: number;
        y: number;
        rotation: number;
    }

    export class AsteroidsFactory {

        private static CREATE_ASTEROIDS_KEY: string = 'CREATE_ASTEROIDS_KEY';

        private asteroidsList: Asteroid[] = [];

        static preload(game: Phaser.Game) {
            Asteroid.preload(game);
        }

        constructor(private game: Phaser.Game, private asteroidsGroup: Phaser.Group) {
            astroids.p2p.receiveText(AsteroidsFactory.CREATE_ASTEROIDS_KEY,
                this.onRemoteAsteroidCreation, this);

            var randX = this.game.rnd.realInRange(0, this.game.world.width * 0.3);
            var randY = this.game.rnd.realInRange(0, this.game.world.height * 0.3);
            var randRot = this.game.rnd.realInRange(0, 2 * Math.PI);
            this.asteroidsList.push(new Asteroid(this.game, randX, randY, randRot, asteroidsGroup));
        }

        onRemoteAsteroidCreation(text: string) {
            var msg: ICreateAsteroidMsg = JSON.parse(text);
            new Asteroid(this.game, msg.x, msg.y, msg.rotation, this.asteroidsGroup);
        }

        pushUpdate() {
            for (var i = 0; i < this.asteroidsList.length; i++) {
                var asteroid: Asteroid = this.asteroidsList[i];
                var msg: ICreateAsteroidMsg = {
                    x: asteroid.x,
                    y: asteroid.y,
                    rotation: asteroid.rotation
                };
                astroids.p2p.sendText(AsteroidsFactory.CREATE_ASTEROIDS_KEY, JSON.stringify(msg));
            }
        }
    }
} 