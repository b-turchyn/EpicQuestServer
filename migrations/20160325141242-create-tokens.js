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
  db.createTable('token', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      length: 10,
      foreignKey: {
        name: 'token_user_id_fk',
        table: 'user',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    token: {
      type: 'string',
      length: 64,
      notNull: true
    },
    ip_address: {
      type: 'string',
      length: 39,
      notNull: true
    }
  }, cb);
};

exports.down = function(db, cb) {
  db.dropTable('token', cb);
};
