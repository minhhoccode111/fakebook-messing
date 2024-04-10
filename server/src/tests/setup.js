const createError = require('http-errors');
const express = require('express');
require('dotenv').config();

// db models, for authentication
const User = require('./../models/user');

const app = express();

// basic setup
app.use(express.json()); // parse json to js object
app.use(express.urlencoded({ extended: false })); //  parse form data

// passport to authenticate a jwt
const passport = require('passport');
// a passport strategy to authentication by passport.use(new JwtStrategy(options, verify))
const JwtStrategy = require('passport-jwt').Strategy;
// to choose ways to extract json web token from request
const ExtractJwt = require('passport-jwt').ExtractJwt;
// option jwt
const options = {
  // extract json web token using Bearer in header
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // secret
  secretOrKey: process.env.SECRET,
};

// init passport within express application
app.use(passport.initialize());

// This is called when passport.authenticate() middleware is called
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      // console.log(`the payload object in passport.use: `, payload);
      const user = await User.findOne({ username: payload.username }, '-password -username -__v').exec();

      // console.log(`the user object in passport.use: `, user);
      if (!user) return done(null, false);

      // success and make req.user available after passport.authenticate() middlewares chain
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// test with fake database
const mongo = require('./mongoConfigTesting');
mongo();

// test with real development database
// require('./../../mongoConfig')

// handle api request
const routes = require('./../routes'); // modular
// things about auth
app.use('/api/v1/auth', routes.auth);
// things about user, need authenticate
// app.use('/api/v1/user', routes.user);
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), routes.user);
// things about chat, need authenticate
// app.use('/api/v1/chat', routes.chat);
app.use('/api/v1/chat', passport.authenticate('jwt', { session: false }), routes.chat);

// if no route handle the request mean it a 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // we can only access the err object in res.locals.error if development, else it's an empty object
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // log the error
  console.log(`the error object: `, err);

  // send the error json to client
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
