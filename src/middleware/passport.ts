import passport from 'passport';
import md5 from 'md5';
import { Strategy as LocalStrategy } from 'passport-local';
import { Op } from 'sequelize';
import User from '../models/user';
import MESSAGE from '../config/message.json';
import UserModel from '../interfaces/masters/user.interface';

const authenticateUser = async (
  employeeCode: string,
  password: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  done: Function,
) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [
          { employeeCode },
          { accountStatus: true },
          { password: { [Op.not]: null } },
        ],
      },
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  passport.serializeUser((user: Partial<UserModel>, done: Function) => {
    done(null, user?.id);
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  passport.deserializeUser(async (userId: string, done: Function) => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default passportMiddleware;
