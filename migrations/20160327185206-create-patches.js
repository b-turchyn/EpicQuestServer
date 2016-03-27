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
  db.createTable('patch', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    major_version: { type: 'int', notNull: true },
    minor_version: { type: 'int', notNull: true },
    patch_number: { type: 'int', notNull: true },
    filename: { type: 'string', length: 128, notNull: true },
    checksum: { type: 'string', length: 40, notNull: true },
    created_at: { type: 'timestamp', notNull: true, defaultValue: 'CURRENT_TIMESTAMP' },
    released_on: { type: 'timestamp' }
  }, cb);
};

exports.down = function(db, cb) {
  db.dropTable('patch', cb);

};
