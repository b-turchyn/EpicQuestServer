var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var io = require('socket.io')(3001);
var util = require('util');
var randomstring = require('randomstring');
var db = require('./lib/db');

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
      res.json({
        result: true,
        token: randomstring.generate(64)
      });
});

app.listen(3000);

io.on('connection', function(socket) {
  io.emit('this', { will: 'be received by everyone' });

  socket.on('ferret', function(name, fn) {
    fn('woot');
  });
});

