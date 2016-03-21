var pbkdf2 = require('pbkdf2'),
    iterations = 1,
    keylength = 32,
    hashStyle = 'sah512';

exports.hashedPassword = function(password, salt) {
  return pbkdf2.pbkdf2(password, salt, iterations, keylength, 'sha512').toString("hex");
};

exports.hashedPasswordSync = function(password, salt) {
  return pbkdf2.pbkdf2Sync(password, salt, iterations, keylength, 'sha512').toString("hex");
};
