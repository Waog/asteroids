astroids.p2p = {};

// You can pick your own id or omit the id if you want to get a random one from
// the server.
astroids.p2p._peer = new Peer(astroids.playerId, {
    key : '8vlzpxgdnobhuxr'
});

// receive data via webRTC
astroids.p2p._peer.on('connection', function(conn) {
    conn.on('data', function(data) {
        console.log('received data: ' + data);

        if (data.match('helloIam*')) {
            astroids.p2p._connectBackTo(data);
        } else if (data.match('kv:*')) {
            var keyValueTriple = data.split(':');
            if (keyValueTriple.length == 3) {
                var key = keyValueTriple[1];
                var value = keyValueTriple[2];
                if (astroids.p2p._receiverCbs[key]) {
                    astroids.p2p._receiverCbs[key].call(
                            astroids.p2p._receiverCbContexts[key], value);
                }
            }
        }
    });
});

// try to connect to other player under any circumstances
astroids.p2p._connection = astroids.p2p._peer.connect(astroids.otherPlayerId);
astroids.p2p._connection.on('open', function() {
    console.log('sending data: ' + 'helloIam' + astroids.playerId);
    astroids.p2p._connection.send('helloIam' + astroids.playerId);
});

astroids.p2p._connectBackTo = function(data) {
    var otherPlayerId = data.slice('helloIam'.length);
    astroids.p2p._connection = astroids.p2p._peer.connect(otherPlayerId);
    astroids.p2p._connection.on('open',
            function() {
                console.log('sending data: ' + 'helloThere, I am '
                        + astroids.playerId);
                astroids.p2p._connection.send('helloThere, I am '
                        + astroids.playerId);
            });
}

astroids.p2p._receiverCbs = {};
astroids.p2p._receiverCbContexts = {};

// send string via webRTC
astroids.p2p.sendText = function(key, text) {
    console.log('sending kv-pair: ' + key + ':' + text);
    astroids.p2p._connection.send('kv:' + key + ':' + text);
}

astroids.p2p.receiveText = function(key, callback, cbContext) {
    console.log('registering for text receiving');
    astroids.p2p._receiverCbs[key] = callback;
    astroids.p2p._receiverCbContexts[key] = cbContext;
}
