import passport from 'passport';
import md5 from 'md5';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';
import MESSAGE from '../config/message.json';
import { Op } from 'sequelize';

const authenticateUser = async (
  employeeCode: string,
  password: string,
  done: Function,
) => {
  try {
    const user = await User.findOne({ 
      where: { 
          [Op.and]: [
              { employeeCode: employeeCode },
              { accountStatus: true },
              { password: { [Op.not]: null } } 
          ]
      } 
    });

    if (user === null) {
      return done(null, false, {
        message: MESSAGE.INVALID_CREDENTIAL,
      });
    }

    const passDb = user.password;
    const passUser = md5(password.trim());

    if (passDb !== passUser) {
      return done(null, false, {
        message: MESSAGE.INVALID_CREDENTIAL,
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(
  {
    usernameField: 'employeeCode',
    passwordField: 'password',
  },
  authenticateUser,
);

const passportMiddleware = () => {
  passport.use(strategy);

  passport.serializeUser((user: any, done: Function) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId: string, done: Function) => {
    try {
      const user = await User.findOne({where: {id: userId}});
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default passportMiddleware;
