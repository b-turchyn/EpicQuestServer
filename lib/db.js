var Client   = require('mariasql'),
    crypto   = require('./crypto'),
    dbconfig = require('../database.json'),
    randomstring = require('randomstring');

var env = process.env.ENV || 'dev';

var c = new Client({
  host: dbconfig[env].host,
  user: dbconfig[env].user,
  password: dbconfig[env].password,
  db: dbconfig[env].database
});

exports.authenticateUser = function(username, password, callback) {
  c.query("SELECT salt FROM users WHERE username = :username", {
    username: username
  }, function(err, rows) {
    if(err) {
      throw err;
    }
    if(rows.length) {
      var hashedPassword = crypto.hashedPasswordSync(password, rows[0].salt);
      console.log(hashedPassword);
      c.query("SELECT id, username FROM users WHERE username = :username AND password = :password", {
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

exports.authenticateUserByToken = function(username, ip_address, token, callback) {
  c.query("SELECT 1 FROM users WHERE username = :username AND last_ip_address = " +
      ":ip_address AND token = :token", {
        username: username,
        ip_address: ip_address,
        token: token
      }, function(err, rows) {
        if(err) {
          throw err;
        }
        if(rows.length) {
          callback(true);
        } else {
          callback(false);
        }
      });
};

exports.getNewToken = function(id, ip_address, callback) {
  token = randomstring.generate(64);
  c.query("UPDATE users SET token = :token, last_ip_address = :ip WHERE id = :id", {
    id: id,
    ip: ip_address,
    token: token
  }, function(err, rows) {
    if(err) {
      throw err;
    } else {
      callback(token);
    }
  });
};

exports.getUserByID = function(id, callback) {
  c.query("SELECT id, username FROM users WHERE id = :id", {
    id: id
  }, function(err, rows) {
    if(rows.length) {
      callback(rows[0]);
    } else {
      callback(false);
    }
  });
};
