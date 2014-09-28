module Astroids {
    declare var astroids: any;

    export class Level1 extends Phaser.State {

        preload() {
            this.load.image('bg', 'assets/bg.png');
        }

        create() {
            astroids.p2p.receiveText(this.onTextReceived);
            var bg = this.add.sprite(0, 0, 'bg');
            bg.inputEnabled = true;
            bg.events.onInputDown.add(this.onClick, this);
        }

        onTextReceived(text: string) {
            console.log('game received ' + text);
        }

        onClick() {
            astroids.p2p.sendText('I am a steroids game sending text');
        }
    }
} 