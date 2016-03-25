var c;
var crypto   = require('../crypto');
var randomstring = require('randomstring');

module.exports = function user(client) {
  c = client;
  return module.exports;
};

module.exports.authenticate = function(username, password, callback) {
  c.query("SELECT salt FROM user WHERE username = :username", {
    username: username
  }, function(err, rows) {
    if(err) {
      throw err;
    }
    if(rows.length) {
      var hashedPassword = crypto.hashedPasswordSync(password, rows[0].salt);
      console.log(hashedPassword);
      c.query("SELECT id, username FROM user WHERE username = :username AND password = :password", {
        username: username,
        password: hashedPassword
      }, function(err, rows) {
        if(rows.length) {
          callback(rows[0]);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  });
};

module.exports.getByID = function(id, callback) {
  c.query("SELECT id, username FROM user WHERE id = :id", {
    id: id
  }, function(err, rows) {
    if(rows.length) {
      callback(rows[0]);
    } else {
      callback(false);
    }
  });
};

module.exports.register = function(username, password, callback) {
  salt = randomstring.generate(256);
  c.query('INSERT INTO user (username, password, salt) VALUES (:username, ' +
        ':password, :salt)', {
    username: username,
    password: crypto.hashedPasswordSync(password, salt),
    salt: salt,
  }, function(err, rows) {
    if (err) {
      callback(err);
    } else {
      console.log(rows);
      if (rows.info && rows.info.affectedRows > 0) {
        callback(null, rows.info.insertId);
      } else {
        callback('No user created');
      }
    }
  });
};
