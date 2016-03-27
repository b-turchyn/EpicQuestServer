var c;

module.exports = function patch(client) {
  c = client;
  return module.exports;
};

module.exports.getPatchesSince = function(major, minor, patch, callback) {
  c.query('SELECT id, major_version, minor_version, patch_number, filename, ' +
      'checksum FROM patch WHERE ((major_version = :major AND minor_version = ' +
      ':minor AND patch_number > :patch) OR (major_version = :major AND ' +
      'minor_version > :minor) OR major_version > :major) AND released_on < ' +
      'CURRENT_TIMESTAMP ORDER BY major_version, minor_version, patch_number', {
        major: major,
        minor: minor,
        patch: patch
      }, function(err, rows) {
        console.log(rows);
        if (err) {
          throw err;
        } else {
          callback(rows);
        }
      });
};
