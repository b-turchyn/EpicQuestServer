var randomstring = require('randomstring');
var c;

module.exports = function(client) {
  c = client;
  return module.exports;
};

module.exports.authenticateUser = function(username, ip_address, token, callback) {
  c.query('SELECT 1 FROM user u INNER JOIN token t ON t.user_id = u.id ' +
      'WHERE u.username = :username AND t.ip_address = :ip_address AND ' +
      't.token = :token', {
        username: username,
        ip_address: ip_address,
        token: token
      }, function(err, rows) {
        if (err) {
          throw err;
        } else {
          callback(!!(rows.length));
        }
      });

};

module.exports.generateToken = function(user_id, ip_address, callback) {
  token = randomstring.generate(64);
  c.query("INSERT INTO token (user_id, ip_address, token) VALUES (:user_id, " +
      ":ip_address, :token)", {
        user_id: user_id,
        ip_address: ip_address,
        token: token,
      }, function(err, rows) {
        if (err) {
          throw err;
        } else {
          callback(token);
        }
      });
};
