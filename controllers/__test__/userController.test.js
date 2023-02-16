const { create } = require('../user.controller');
const User = require('../../models').user;

describe('create user', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'John Doe',
        mobile: '9876543210',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a user', async () => {
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      code: '201',
      status: 'success',
      message: 'Created',
      data: null,
    });

    const user = await User.findOne({ where: { email: 'johndoe@example.com' } });
    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.mobile).toBe('9876543210');
    expect(user.password).not.toBe('password123');
  });

  it('should return a 400 response if request body is empty', async () => {
    req.body = {};
    await create(req, res);

    expect(res.send).toHaveBeenCalledWith({
      code: '400',
      status: 'failure',
      message: 'Content can not be empty!',
      data: null,
    });
  });

  it('should return a 400 response if mobile number is invalid', async () => {
    req.body.mobile = '1234567890';
    await create(req, res);

    expect(res.send).toHaveBeenCalledWith({
      code: '400',
      status: 'BAD_REQUEST',
      message: 'Invalid mobile number!',
      data: null,
    });
  });
});
