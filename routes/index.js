const UserController = require('../controllers/user.controller');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user/paginate', UserController.findWithPaginate);
};
