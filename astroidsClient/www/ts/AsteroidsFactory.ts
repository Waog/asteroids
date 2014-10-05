module Astroids {
    declare var astroids: any;

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
            var messageArray = text.split(';');
            var messageX: number = +messageArray[0];
            var messageY: number = +messageArray[1];
            var messageRotation: number = +messageArray[2];
            new Asteroid(this.game, messageX, messageY, messageRotation);
        }

        pushUpdate() {
            for (var i = 0; this.asteroidsList.length; i++) {
                var asteroid: Asteroid = this.asteroidsList[i];
                console.log('asteroidFac.pushUpdate(): ', AsteroidsFactory.CREATE_ASTEROIDS_KEY,
                    asteroid.x + ';' + asteroid.y + ';' + asteroid.rotation + ';');
                astroids.p2p.sendText(AsteroidsFactory.CREATE_ASTEROIDS_KEY,
                    asteroid.x + ';' + asteroid.y + ';' + asteroid.rotation + ';');
            }
        }
    }
} 