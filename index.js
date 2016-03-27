var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var util = require('util');
var db = require('./lib/db');
var gameserver = require('./lib/gameserver');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, {id: id});
});

var app = express();
app.use(express.static('./public'));
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());


passport.use(new LocalStrategy(
  function(user, password, done) {
    result = db.user.authenticate(user, password, function(result) {
      return done(null, result);
    });
  }
));

app.post('/api/v1/login', 
    passport.authenticate('local'),
    function(req, res) {
      console.log('Passed authentication');
      db.token.generateToken(req.user.id, req.client.remoteAddress, function(token) {
        res.json({
          result: true,
          token: token
        });
      });
});

app.get('/api/v1/patches',
    function(req, res) {
      db.patch.getPatchesSince(req.query.major,
                               req.query.minor,
                               req.query.patch,
                               function(result) {
                                 console.log('result: ' + result);
                                 res.json(result || {});
                               });
    });

app.post('/api/v1/register',
    function(req, res) {
      console.log('Attempting to register user');
      db.user.register(req.body.username, req.body.password, function(err, user) {
        console.log("result: " + user);
        if (!user) {
          res.status(403).send(err);
        } else {
          res.json({
            result: !!user
          });
        }
      });
    });

app.listen(3000);

console.log('API Server listening on port ' + 3000);

gameserver.gameserver(3001, db);

