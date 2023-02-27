const passport = require('passport');
const md5 = require('md5');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').user;

const authenticateUser = async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (user === null) {
      return done(null, false, {
        message: 'Invalid credentials!',
      });
    }

    const passDb = user.password;
    const passUser = md5(password.trim());

    if (passDb !== passUser) {
      return done(null, false, {
        message: 'Invalid credentials!',
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  authenticateUser,
);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findByPk(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
