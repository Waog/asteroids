var peer = new Peer('someIdB', {key: '8vlzpxgdnobhuxr'});
//You can pick your own id or omit the id if you want to get a random one from the server.
console.log('peer: ' + peer);

var conn = peer.connect('someIdA');
conn.on('open', function(){
  conn.send('hi!');
});