var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var io = require('socket.io')(3001);
var util = require('util');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

console.log('this actually works');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Attempting local auth');
    return done(null, { id: 1, user: "foo", password: "bar" });
  }
));

passport.serializeUser(function(user, done) {
  console.log('Serialize');
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('Deserialize');
  done(null, {id: id});
});

var app = express();
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());

/*
 *passport.use(new LocalStrategy(
 *  function(user, password, done) {
 *    console.log('Attempting local strategy');
 *    if(user === "foo" && password === "bar") {
 *      return done(null, { user: "foo", password: "bar" });
 *    } else {
 *      return done(null, false);
 *    }
 *  }
 *));
 */

app.post('/api/v1/login', 
    passport.authenticate('local'),
    function(req, res) {
      console.log('Passed authentication');
      res.json({
        result: true,
        token: "abc123"
      });
});

app.post('/login', passport.authenticate('local'));

/*
 *http.createServer(function(req, res) {
 *  var body = "";
 *  console.log('Request received');
 *  util.log(util.inspect(req));
 *
 *  req.on('data', function(chunk) {
 *    body += chunk;
 *    console.log('GOT DATA');
 *    res.writeHead(200, { 'Content-Type': 'text/plain' });
 *  });
 *
 *  req.on('end', function() {
 *    console.log('POSTed: ' + body);
 *
 *  });
 *
 *  res.end('callback(\'{\"msg\": \"OK\"}\')');
 *}).listen(3000);
 *
 */
app.listen(3000);

io.on('connection', function(socket) {
  io.emit('this', { will: 'be received by everyone' });

  socket.on('ferret', function(name, fn) {
    fn('woot');
  });
});

console.log('this does too');

