var zmq = require('zmq');

function Client(bmq, type) {
  this.id = 0;
  this.sck = {};
  this.bmq = bmq;
  this.id = this.bmq.uuid();
  this.type = type;
}
module.exports = Client;

Client.prototype.connect = function(address, port) {
  this.sck = zmq.socket('push');
  this.sck.connect('tcp://' + address + ':' + port);

  if (this.type == 'res') return;

  var obj = {};
  obj.handshake = 1;
  obj.id = this.id;
  obj.address = this.bmq.server.address;
  obj.port = this.bmq.server.port;
  this.sck.send(JSON.stringify(obj));
}

Client.prototype.send = function(data, callback) {
  var obj = {};
  obj.id = this.id;
  obj.mid = this.bmq.uuid();
  obj.data = data;
  this.sck.send(JSON.stringify(obj));

  if (callback)
    this.bmq.server.callback[obj.mid] = callback;
}
