var peer = new Peer('someIdA', {key: '8vlzpxgdnobhuxr'});
//You can pick your own id or omit the id if you want to get a random one from the server.
console.log('peer: ' + peer);

peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });