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
  db.createTable('user', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      length: 10,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: 'string',
      length: 64,
      unique: true,
      notNull: true
    },
    password: {
      type: 'string',
      length: 64,
      notNull: true
    },
    salt: {
      type: 'string',
      length: 256,
      notNull: true
    },
    last_ip_address: { type: 'string', length: 39 },
  }, cb);
};

exports.down = function(db, cb) {
  db.dropTable('user', cb);
};
