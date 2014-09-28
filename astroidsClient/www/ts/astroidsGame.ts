declare var astroids: any;

var game = new Phaser.Game(1200, 500, Phaser.CANVAS, 'astroids', {
    preload : preload,
    create : create
});

function preload() {
    game.load.image('bg', 'assets/bg.png');
}

function create() {
    astroids.p2p.receiveText(onTextReceived);
    var image = game.add.sprite(0, 0, 'bg');
    image.inputEnabled = true;
    image.events.onInputDown.add(onClick, this);
}

function onClick() {
    astroids.p2p.sendText('I am a steroids game sending text');
}

function onTextReceived(text: string) {
    console.log('game received ' + text);
}