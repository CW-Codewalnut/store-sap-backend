const passport = require('passport');
const md5 = require('md5');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').user;

const authenticateUser = async (username, password, done) => {
  try {
    const email = '';
    console.log('test=========> ', username, password);
    const user = await User.findOne({ where: { email } });

    if (user === null) return done(null, false, { message: 'No user with that email' });

    const passDb = user.password;
    const passUser = md5(password.trim());

    if (passDb === passUser) return done(null, user);
    console.log('authenticateUser======> ', email, password);
    return done(null, false, { message: 'Bad request!' });
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    // passReqToCallback: true,
  },
  authenticateUser,
);
passport.use(strategy);

passport.serializeUser((user, done) => {
  console.log('serializeUser======> ', user);
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    console.log('deserializeUser======> ', userId);
    const user = await User.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
