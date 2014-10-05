module Astroids {
    declare var astroids: any;

    interface ICreateAsteroidsMsg {
        x: number;
        y: number;
        rotation: number;
    }

    export class AsteroidsFactory {

        private static CREATE_ASTEROIDS_KEY: string = 'CREATE_ASTEROIDS_KEY';

        asteroidsList: Asteroid[] = [];

        static preload(game: Phaser.Game) {
            Asteroid.preload(game);
        }

        constructor(private game: Phaser.Game) {
            astroids.p2p.receiveText(AsteroidsFactory.CREATE_ASTEROIDS_KEY,
                this.onRemoteAsteroidCreation, this);

            var randX = this.game.rnd.realInRange(0, this.game.world.width * 0.3);
            var randY = this.game.rnd.realInRange(0, this.game.world.height * 0.3);
            var randRot = this.game.rnd.realInRange(0, 2 * Math.PI);
            this.asteroidsList.push(new Asteroid(this.game, randX, randY, randRot));
        }

        onRemoteAsteroidCreation(text: string) {
            var msg: ICreateAsteroidsMsg = JSON.parse(text);
            new Asteroid(this.game, msg.x, msg.y, msg.rotation);
        }

        pushUpdate() {
            for (var i = 0; i < this.asteroidsList.length; i++) {
                var asteroid: Asteroid = this.asteroidsList[i];
                var msg: ICreateAsteroidsMsg = {
                    x: asteroid.x,
                    y: asteroid.y,
                    rotation: asteroid.rotation
                };
                astroids.p2p.sendText(AsteroidsFactory.CREATE_ASTEROIDS_KEY, JSON.stringify(msg));
            }
        }
    }
} 