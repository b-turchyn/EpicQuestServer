var Client = require('mariasql'),
    crypto = require('./crypto');

var c = new Client({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  db: 'epicquest_development'
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
