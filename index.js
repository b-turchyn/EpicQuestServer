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
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());


passport.use(new LocalStrategy(
  function(user, password, done) {
    result = db.authenticateUser(user, password, function(result) {
      return done(null, result);
    });
  }
));

app.post('/api/v1/login', 
    passport.authenticate('local'),
    function(req, res) {
      console.log('Passed authentication');
      db.getNewToken(req.user.id, req.client.remoteAddress, function(token) {
        res.json({
          result: true,
          token: token
        });
      });
});

app.listen(3000);
gameserver.gameserver(3001, db);

