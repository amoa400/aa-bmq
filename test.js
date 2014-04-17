// TODO: 心跳检测
var bmq = require('./lib');

// res
var resServer = bmq.socket('res-server');
resServer.bind('127.0.0.1', 3600);
resServer.on('message', function(socket, data) {
  console.log('req: ' + data);
  socket.send(data + 1);
});

// req
var reqServer = bmq.socket('req-server');
reqServer.bind('127.0.0.1', 3601);
var client = bmq.socket('req-client');
client.connect('127.0.0.1', 3600);

setTimeout(function() {
  client.send({t: 1}, function(data) {
    console.log('res: ' + data);
  });
}, 100);

// req2
var client2 = bmq.socket('req-client');
client2.connect('127.0.0.1', 3600);

setTimeout(function() {
  client2.send(5, function(data) {
    console.log('res: ' + data);
  });
}, 100);