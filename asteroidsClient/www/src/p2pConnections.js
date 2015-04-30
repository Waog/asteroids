asteroids.p2p = {};

asteroids.p2p._HANDSHAKE_0_PREFIX = 'EstablishOneWayConnection: ';
asteroids.p2p._HANDSHAKE_1_PREFIX = 'ConnectBack: ';
asteroids.p2p._KEY_VALUE_PREFIX = 'kvPair: ';
asteroids.p2p._KEY_VALUE_SEPERATOR = ' --> ';

asteroids.p2p._receiverCbs = {};
asteroids.p2p._receiverCbContexts = {};
asteroids.p2p._receiverCbDebugFlag = {};

asteroids.p2p._peer;

asteroids.p2p.connect = function() {
    asteroids.p2p._peer = new Peer(asteroids.playerId, {
        key : '8vlzpxgdnobhuxr'
    });

    // receive data via webRTC
    asteroids.p2p._peer.on('connection', function(conn) {
        conn.on('data', asteroids.p2p._onReceiveData);
    });

    // try to connect to other player under any circumstances
    asteroids.p2p._connection = asteroids.p2p._peer
            .connect(asteroids.otherPlayerId);
    asteroids.p2p._connection.on('open', function() {
        console.log('sending data: ' + asteroids.p2p._HANDSHAKE_0_PREFIX
                + asteroids.playerId);
        asteroids.p2p._connection.send(asteroids.p2p._HANDSHAKE_0_PREFIX
                + asteroids.playerId);
    });
}

asteroids.p2p._onReceiveData = function(data) {

    if (data.match(asteroids.p2p._HANDSHAKE_0_PREFIX + '*')) {
        console.log('received data: ' + data);
        var dataValue = data.slice(asteroids.p2p._HANDSHAKE_0_PREFIX.length);
        asteroids.p2p._connectBackTo(dataValue);

    } else if (data.match(asteroids.p2p._HANDSHAKE_1_PREFIX + '*')) {
        console.log('received data: ' + data);
        asteroids.p2p._handshakeCb.call(asteroids.p2p._handshakeCbContext);

    } else if (data.match(asteroids.p2p._KEY_VALUE_PREFIX + '*')) {
        var dataValue = data.slice(asteroids.p2p._KEY_VALUE_PREFIX.length);
        asteroids.p2p._handleKeyValueData(dataValue);
    }
}

asteroids.p2p._handleKeyValueData = function(keyValueData) {
    var keyValueTuple = keyValueData.split(asteroids.p2p._KEY_VALUE_SEPERATOR);
    if (keyValueTuple.length == 2) {
        var key = keyValueTuple[0];
        var value = keyValueTuple[1];
        if (asteroids.p2p._receiverCbs[key]) {
            if (asteroids.p2p._receiverCbDebugFlag[key]) {
                console.log("received " + key + ": " + value);
            }
            asteroids.p2p._receiverCbs[key].call(
                    asteroids.p2p._receiverCbContexts[key], value);
        }
    }
}

asteroids.p2p._connectBackTo = function(remotePlayerId) {
    asteroids.p2p._connection = asteroids.p2p._peer.connect(remotePlayerId);
    asteroids.p2p._connection.on('open', function() {
        console.log('sending data: ' + asteroids.p2p._HANDSHAKE_1_PREFIX);
        asteroids.p2p._connection.send(asteroids.p2p._HANDSHAKE_1_PREFIX);
        asteroids.p2p._handshakeCb.call(asteroids.p2p._handshakeCbContext);
    });
}

// send string via webRTC
asteroids.p2p.sendText = function(key, text, debugFlag) {
    if (debugFlag) {
        console.log('sending kv-pair: ' + key
                + asteroids.p2p._KEY_VALUE_SEPERATOR + text);
    }
    asteroids.p2p._connection.send(asteroids.p2p._KEY_VALUE_PREFIX + key
            + asteroids.p2p._KEY_VALUE_SEPERATOR + text);
}

asteroids.p2p.receiveText = function(key, callback, cbContext, debugFlag) {
    if (debugFlag) {
        console.log('registering for text receiving: ', key, callback, cbContext);
    }
    asteroids.p2p._receiverCbs[key] = callback;
    asteroids.p2p._receiverCbContexts[key] = cbContext;
    asteroids.p2p._receiverCbDebugFlag[key] = debugFlag;
}

asteroids.p2p.onHandshakeFinished = function(callback, context) {
    console.log('registering for handshakeFinished');
    asteroids.p2p._handshakeCb = callback;
    asteroids.p2p._handshakeCbContext = context;
}
