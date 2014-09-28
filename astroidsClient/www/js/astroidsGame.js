var game = new Phaser.Game(1200, 500, Phaser.CANVAS, 'astroids', {
    preload : preload,
    create : create
});

function preload() {
    game.load.image('bg', 'assets/bg.png');
}

function create() {
    game.add.sprite(0, 0, 'bg');
}