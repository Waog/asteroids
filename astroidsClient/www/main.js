// You can pick your own id or omit the id if you want to get a random one from
// the server.
var peer = new Peer(astroids.playerId, {
    key : '8vlzpxgdnobhuxr'
});

// receive data via webRTC
peer.on('connection', function(conn) {
    conn.on('data', function(data) {
        console.log('received data: ' + data);
        
        if (data.match('helloIam*')) {
            astroids.connectBackTo(data);
        }
    });
});

//connect to other player if available
var conn = peer.connect(astroids.otherPlayerId);
conn.on('open', function() {
    console.log('sending data: ' + 'helloIam' + astroids.playerId);
    conn.send('helloIam' + astroids.playerId);
});

astroids.connectBackTo = function(data) {
    var otherPlayerId = data.slice('helloIam'.length);
    conn = peer.connect(otherPlayerId);
    conn.on('open', function() {
        console.log('sending data: ' + 'helloThere, I am ' + astroids.playerId);
        conn.send('helloThere, I am ' + astroids.playerId);
    });
}

// send data via webRTC
astroids.onPingOtherPlayer = function() {
    console.log('i was clicked!');
    conn.send('hi ' + astroids.playerId + ' was clicked!');
}