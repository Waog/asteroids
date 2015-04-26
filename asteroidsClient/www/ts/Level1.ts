import PlayerFile = require('Player');
import Player = PlayerFile.Player;

import AsteroidsFactoryFile = require('AsteroidsFactory');
import AsteroidsFactory = AsteroidsFactoryFile.AsteroidsFactory;

declare var asteroids: any;

export class Level1 extends Phaser.State {

    private localPlayer: Player;
    private asteroidsFactory: AsteroidsFactory;

    private static CREATE_PLAYER_KEY: string = 'createPlayer';

    preload() {
        this.load.image('bg', 'assets/bg.png');
        Player.preload(this.game);
        AsteroidsFactory.preload(this.game);

        this.stage.disableVisibilityChange = true;
    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg = this.add.sprite(0, 0, 'bg');

        var asteroidsGroup: Phaser.Group = this.game.add.group();
        asteroidsGroup.enableBody = true;
        asteroidsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this.createLocalPlayer(asteroidsGroup);
        this.asteroidsFactory = new AsteroidsFactory(this.game, asteroidsGroup);

        asteroids.p2p.receiveText(Level1.CREATE_PLAYER_KEY, this.onNewPlayer, this);
        asteroids.p2p.onHandshakeFinished(this.onHandshakeFinished, this);
        asteroids.p2p.connect();


    }

    onNewPlayer(text: string) {
        console.log('level 1 received ' + text);
        var messageArray = text.split(';');
        var messageX: number = +messageArray[0];
        var messageY: number = +messageArray[1];
        new Player(this.game, messageX, messageY, false, null);
    }

    createLocalPlayer(asteroidsGroup: Phaser.Group) {
        var randX = this.game.rnd.realInRange(0, this.world.width * 0.3);
        var randY = this.game.rnd.realInRange(0, this.world.height * 0.3);
        this.localPlayer = new Player(this.game, randX, randY, true, asteroidsGroup);
    }

    onHandshakeFinished() {
        console.log('level1 sending', Level1.CREATE_PLAYER_KEY, this.localPlayer.x + ';'
            + this.localPlayer.y + ';');
        asteroids.p2p.sendText(Level1.CREATE_PLAYER_KEY, this.localPlayer.x + ';'
            + this.localPlayer.y + ';');
        this.asteroidsFactory.pushUpdate();
    }
}