import passport from 'passport';
import md5 from 'md5';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';

const authenticateUser = async (
  email: string,
  password: string,
  done: Function,
) => {
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

const passportFn = () => {
  passport.use(strategy);

  passport.serializeUser((user: any, done: Function) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId: string, done: Function) => {
    try {
      const user = await User.findByPk(userId);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default passportFn;
