const RateLimit = require('express-rate-limit');
const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// connect mongo db
require('./mongoConfig');

// db models, for authentication
const User = require('./src/models/user');

const app = express();

// reduce fingerprinting
app.disable('x-powered-by');

// rate limit // TODO change to 120 in production
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 1600 }); // max 160/min
app.use(limiter);

// compress responses for performance
app.use(compression());

// security HTTP header
app.use(helmet());

// setup CORS (Cross-origin Resources Sharing) to allow request from any origin
const cors = require('cors');
// app.use(cors()); // TODO is used for development
app.use(
  cors({
    origin: [
      'http://localhost:5173', // development frontend
      'http://localhost:4173', // development frontend preview
      'http://localhost:3000', // development postman
      'https://messagingapptop.vercel.app', // production
    ],
    methods: 'GET,POST,PUT,DELETE', // simple CRUD actions
  })
);

// basic setup
app.use(logger('dev')); // logger
app.use(express.json()); // parse json to js object
app.use(express.urlencoded({ extended: false })); //  parse form data
app.use(express.static(path.join(__dirname, 'public'))); // server things in public

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
      // debug(`the payload object in passport.use: `, payload);
      const user = await User.findOne({ username: payload.username }, '-password -username -__v').exec();

      // debug(`the user object in passport.use: `, user);
      if (!user) return done(null, false);

      // success and make req.user available after passport.authenticate() middlewares chain
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// handle api request
const routes = require('./src/routes'); // modular
// things about auth
app.use('/api/v1/auth', routes.auth);
// things about user, need authenticate
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), routes.user);
// things about chat, need authenticate
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
  debug(`the error object: `, err);

  // send the error json to client
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
