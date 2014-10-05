module Astroids {
    declare var astroids: any;

    export class AsteroidsFactory {

        asteroidsList: Asteroid[] = [];

        static preload(game: Phaser.Game) {
            Asteroid.preload(game);
        }

        constructor(private game: Phaser.Game) {
            astroids.p2p.receiveText(AsteroidsFactory.CreateAstroidsMsg.KEY,
                this.onRemoteAsteroidCreation, this);

            var randX = this.game.rnd.realInRange(0, this.game.world.width * 0.3);
            var randY = this.game.rnd.realInRange(0, this.game.world.height * 0.3);
            var randRot = this.game.rnd.realInRange(0, 2 * Math.PI);
            this.asteroidsList.push(new Asteroid(this.game, randX, randY, randRot));
        }

        onRemoteAsteroidCreation(text: string) {
            var msg: AsteroidsFactory.CreateAstroidsMsg =
                    AsteroidsFactory.CreateAstroidsMsg.fromText(text);
            new Asteroid(this.game, msg.x, msg.y, msg.rotation);
        }

        pushUpdate() {
            for (var i = 0; this.asteroidsList.length; i++) {
                var asteroid: Asteroid = this.asteroidsList[i];
                var msg: AsteroidsFactory.CreateAstroidsMsg =
                    new AsteroidsFactory.CreateAstroidsMsg(
                        asteroid.x, asteroid.y, asteroid.rotation);
                astroids.p2p.sendText(AsteroidsFactory.CreateAstroidsMsg.KEY,
                    msg.getMsgText());
            }
        }
    }

    export module AsteroidsFactory {
        export class CreateAstroidsMsg {

            public static KEY: string = 'CREATE_ASTEROIDS_MSG_KEY';

            static fromText(text: string) {
                var messageArray = text.split(';');
                return new CreateAstroidsMsg(+messageArray[0], +messageArray[1], +messageArray[2]);
            }

            constructor(public x: number, public y: number, public rotation: number) {
            }

            getMsgText() {
                return this.x + ';' + this.y + ';' + this.rotation + ';';
            }
        }
    }
} 