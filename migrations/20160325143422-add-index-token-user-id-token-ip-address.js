'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, cb) {
  db.addIndex('token', 'idx_user_ip_token', [
        'user_id',
        'ip_address',
        'token',
      ], true, cb);
};

exports.down = function(db, cb) {
  db.removeIndex('token', 'idx_user_ip_token', cb);
};
