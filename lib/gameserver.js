var socket = require('socket.io');
exports.gameserver = function(port, db) {
  var io = socket(port);
  io.on('connection', function(socket) {
    io.emit('this', { will: 'be received by everyone' });

    socket.on('auth', function(username, token, cb) {
      db.token.authenticateUser(username, socket.handshake.address, token, function(result) {
        if(result) {
          cb(true);
        } else {
          cb(false);
          socket.disconnect();
        }
      });
    });

    socket.on('ferret', function(name, cb) {
      cb('woot');
    });
  });

  console.log('Game server listening on port ' + port);
};
