module Astroids {
    declare var astroids: any;

    export class Level1 extends Phaser.State {

        player: Phaser.Sprite;

        otherPlayer: Phaser.Sprite;
        leftKey: Phaser.Key;
        rightKey: Phaser.Key;

        preload() {
            this.load.image('bg', 'assets/bg.png');
            this.load.image('player', 'assets/player040.png');
        }

        create() {
            astroids.p2p.receiveText(this.onTextReceived, this);

            var bg = this.add.sprite(0, 0, 'bg');
            bg.inputEnabled = true;
            bg.events.onInputDown.add(this.onClick, this);

            var randX = this.game.rnd.realInRange(0, this.world.width * 0.95);
            var randY = this.game.rnd.realInRange(0, this.world.height * 0.95);
            this.player = this.add.sprite(randX, randY, 'player');
            this.player.anchor.set(0.5, 0.5);


            this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        }

        update() {

            if (this.leftKey.isDown) {
                this.player.angle -= 3;
            }
            else if (this.rightKey.isDown) {
                this.player.angle += 3;
            }
            astroids.p2p.sendText(this.player.position.x + ';' + this.player.position.y + ';' + this.player.angle + ';');

        }

        onTextReceived(text: string) {
            console.log('game received ' + text);
            var messageArray = text.split(';');
            var messageX: number = +messageArray[0];
            var messageY: number = +messageArray[1];
            var messageAngle: number = +messageArray[2];

            if (!this.otherPlayer) {
                this.otherPlayer = this.add.sprite(messageX, messageY, 'player');
                this.otherPlayer.anchor.set(0.5, 0.5);
            }
            this.otherPlayer.angle = messageAngle;
        }

        onClick() {
            astroids.p2p.sendText('I am a steroids game sending text');
        }
    }
} 