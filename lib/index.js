var zmq = require('zmq');
var Server = require('./server');
var Client = require('./client');

function BMQ() {
  this.server = {};
  this.client = {};
}
module.exports = new BMQ();

BMQ.prototype.socket = function(type) {
  if (type == 'res-server') {
    this.server = new Server(this, 'res');
    return this.server;
  } 
  else 
  if (type == 'req-server') {
    this.server = new Server(this, 'req');
    return this.server;
  }
  else
  if (type == 'req-client') {
    var client = new Client(this, 'req');
    return client;
  }
}

BMQ.prototype.uuid = function() {
  var set = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.#@!';
  var s = '';
  for (var i = 0; i < 10; i++) {
    s += set[parseInt(Math.random() * set.length)];
  }
  s += new Date().getTime();
  return s;
}

