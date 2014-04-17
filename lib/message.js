function Message(client, id) {
  this.client = client;
  this.id = id;
}
module.exports = Message;

Message.prototype.send = function(data) {
  if (!this.client) return;

  var obj = {};
  obj.id = this.id;
  obj.data = data;
  this.client.sck.send(JSON.stringify(obj));
}