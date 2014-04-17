var util = require('util');
var EventEmitter = require('events').EventEmitter;
var zmq = require('zmq');
var Client = require('./client');
var Message = require('./message');

function Server(bmq, type) {
  EventEmitter.call(this);
  this.sck = {};
  this.bmq = bmq;
  this.type = type;
  this.address = '';
  this.port = '';
  this.callback = {};
}
util.inherits(Server, EventEmitter);
module.exports = Server;

Server.prototype.bind = function(address, port) {
  this.address = address;
  this.port = port;

  this.sck = zmq.socket('pull');
  this.sck.bindSync('tcp://' + address + ':' + port);
  if (this.type == 'res')
    this.sck.on('message', this.resMessage.bind(this));
  else
    this.sck.on('message', this.reqMessage.bind(this));
}

Server.prototype.resMessage = function(data) {
  data = JSON.parse(data);

  // 握手信息
  if (data.handshake) {
    var client = new Client(this.bmq, 'res');
    client.id = data.id;
    client.connect(data.address, data.port, true);
    this.bmq.client[client.id] = client;
    return;
  }

  // 普通信息
  var message = null;
  if (this.bmq.client[data.id])
    message = new Message(this.bmq.client[data.id], data.mid);
  message = message ? message : new Message(null, null);
  this.emit('message', message, data.data);
}

Server.prototype.reqMessage = function(data) {
  data = JSON.parse(data);

  if (this.callback[data.id]) {
    this.callback[data.id](data.data);
    delete this.callback[data.id];
  }
}

