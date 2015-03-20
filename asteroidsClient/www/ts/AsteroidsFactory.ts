module Asteroids {
    declare var asteroids: any;

    interface ICreateAsteroidMsg {
        x: number;
        y: number;
        rotation: number;
        remoteId: string;
    }

    export class AsteroidsFactory {

        private static CREATE_ASTEROIDS_KEY: string = 'CREATE_ASTEROIDS_KEY';

        private localAsteroidsList: Asteroid[] = [];

        static preload(game: Phaser.Game) {
            Asteroid.preload(game);
        }

        constructor(private game: Phaser.Game, private asteroidsGroup: Phaser.Group) {
            asteroids.p2p.receiveText(AsteroidsFactory.CREATE_ASTEROIDS_KEY,
                this.onRemoteAsteroidCreation, this);

            var randX = this.game.rnd.realInRange(this.game.world.width * 0.6, this.game.world.width * 0.9);
            //            var randX = this.game.rnd.realInRange(0, this.game.world.width * 0.3);
            var randY = this.game.rnd.realInRange(0, this.game.world.height * 0.3);
            var randRot = Math.PI / 2; // TODO: for debugging only.
            // var randRot = this.game.rnd.realInRange(0, 2 * Math.PI);
            this.localAsteroidsList.push(new Asteroid(this.game, randX, randY, randRot, asteroidsGroup));
        }

        onRemoteAsteroidCreation(text: string) {
            var msg: ICreateAsteroidMsg = JSON.parse(text);
            new Asteroid(this.game, msg.x, msg.y, msg.rotation, this.asteroidsGroup, msg.remoteId);
        }

        pushUpdate() {
            for (var i = 0; i < this.localAsteroidsList.length; i++) {
                var asteroid: Asteroid = this.localAsteroidsList[i];
                
                if (! asteroid.exists) {
                    continue;
                }
                
                var msg: ICreateAsteroidMsg = {
                    x: asteroid.x,
                    y: asteroid.y,
                    rotation: asteroid.rotation,
                    remoteId: asteroid.getRemoteId()
                };
                asteroids.p2p.sendText(AsteroidsFactory.CREATE_ASTEROIDS_KEY, JSON.stringify(msg));
            }
        }
    }
} 