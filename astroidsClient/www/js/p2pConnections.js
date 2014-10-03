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
		}
		else if (astroids.p2p._receiverCb && data.match('text:*')) {
			astroids.p2p._receiverCb.call(astroids.p2p._receiverCbContext, data.slice('text:'.length));
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

// send string via webRTC
astroids.p2p.sendText = function(text) {
	console.log('sending text: ' + text);
	astroids.p2p._connection.send('text:' + text);
}

astroids.p2p.receiveText = function(callback, cbContext) {
	console.log('registering for text receiving');
	astroids.p2p._receiverCb = callback;
	astroids.p2p._receiverCbContext = cbContext;
}
