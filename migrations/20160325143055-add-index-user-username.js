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
  db.addIndex('user', 'idx_user_username', ['username'], true, cb);
};

exports.down = function(db, cb) {
  db.removeIndex('user', 'idx_user_username', cb);
};
