var Client   = require('mariasql'),
    dbconfig = require('../database.json');


var env = process.env.ENV || 'dev';

var c = new Client({
  host: dbconfig[env].host,
  user: dbconfig[env].user,
  password: dbconfig[env].password,
  db: dbconfig[env].database
});

module.exports.patch = require('./db/patch')(c);
module.exports.token = require('./db/token')(c);
module.exports.user = require('./db/user')(c);

module.exports.authenticateUserByToken = function(username, ip_address, token, callback) {
  c.query("SELECT 1 FROM user WHERE username = :username AND last_ip_address = " +
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
