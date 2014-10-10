astroids.p2p = {};

astroids.p2p._HANDSHAKE_0_PREFIX = 'EstablishOneWayConnection: ';
astroids.p2p._HANDSHAKE_1_PREFIX = 'ConnectBack: ';
astroids.p2p._KEY_VALUE_PREFIX = 'kvPair: ';
astroids.p2p._KEY_VALUE_SEPERATOR = ' --> ';

astroids.p2p._receiverCbs = {};
astroids.p2p._receiverCbContexts = {};
astroids.p2p._receiverCbDebugFlag = {};

astroids.p2p._peer;

astroids.p2p.connect = function() {
    astroids.p2p._peer = new Peer(astroids.playerId, {
        key : '8vlzpxgdnobhuxr'
    });

    // receive data via webRTC
    astroids.p2p._peer.on('connection', function(conn) {
        conn.on('data', astroids.p2p._onReceiveData);
    });

    // try to connect to other player under any circumstances
    astroids.p2p._connection = astroids.p2p._peer
            .connect(astroids.otherPlayerId);
    astroids.p2p._connection.on('open', function() {
        console.log('sending data: ' + astroids.p2p._HANDSHAKE_0_PREFIX
                + astroids.playerId);
        astroids.p2p._connection.send(astroids.p2p._HANDSHAKE_0_PREFIX
                + astroids.playerId);
    });
}

astroids.p2p._onReceiveData = function(data) {

    if (data.match(astroids.p2p._HANDSHAKE_0_PREFIX + '*')) {
        console.log('received data: ' + data);
        var dataValue = data.slice(astroids.p2p._HANDSHAKE_0_PREFIX.length);
        astroids.p2p._connectBackTo(dataValue);

    } else if (data.match(astroids.p2p._HANDSHAKE_1_PREFIX + '*')) {
        console.log('received data: ' + data);
        astroids.p2p._handshakeCb.call(astroids.p2p._handshakeCbContext);

    } else if (data.match(astroids.p2p._KEY_VALUE_PREFIX + '*')) {
        var dataValue = data.slice(astroids.p2p._KEY_VALUE_PREFIX.length);
        astroids.p2p._handleKeyValueData(dataValue);
    }
}

astroids.p2p._handleKeyValueData = function(keyValueData) {
    var keyValueTuple = keyValueData.split(astroids.p2p._KEY_VALUE_SEPERATOR);
    if (keyValueTuple.length == 2) {
        var key = keyValueTuple[0];
        var value = keyValueTuple[1];
        if (astroids.p2p._receiverCbs[key]) {
            if (astroids.p2p._receiverCbDebugFlag[key]) {
                console.log("received " + key + ": " + value);
            }
            astroids.p2p._receiverCbs[key].call(
                    astroids.p2p._receiverCbContexts[key], value);
        }
    }
}

astroids.p2p._connectBackTo = function(remotePlayerId) {
    astroids.p2p._connection = astroids.p2p._peer.connect(remotePlayerId);
    astroids.p2p._connection.on('open', function() {
        console.log('sending data: ' + astroids.p2p._HANDSHAKE_1_PREFIX);
        astroids.p2p._connection.send(astroids.p2p._HANDSHAKE_1_PREFIX);
        astroids.p2p._handshakeCb.call(astroids.p2p._handshakeCbContext);
    });
}

// send string via webRTC
astroids.p2p.sendText = function(key, text, debugFlag) {
    if (debugFlag) {
        console.log('sending kv-pair: ' + key
                + astroids.p2p._KEY_VALUE_SEPERATOR + text);
    }
    astroids.p2p._connection.send(astroids.p2p._KEY_VALUE_PREFIX + key
            + astroids.p2p._KEY_VALUE_SEPERATOR + text);
}

astroids.p2p.receiveText = function(key, callback, cbContext, debugFlag) {
    console.log('registering for text receiving');
    astroids.p2p._receiverCbs[key] = callback;
    astroids.p2p._receiverCbContexts[key] = cbContext;
    astroids.p2p._receiverCbDebugFlag[key] = debugFlag;
}

astroids.p2p.onHandshakeFinished = function(callback, context) {
    console.log('registering for handshakeFinished');
    astroids.p2p._handshakeCb = callback;
    astroids.p2p._handshakeCbContext = context;
}
