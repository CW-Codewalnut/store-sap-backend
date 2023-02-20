const UserController = require('../controllers/user.controller');
const PlantController = require('../controllers/plant.controller');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user/paginate', UserController.findWithPaginate);

  app.get('/plant/:id', PlantController.getPlantsByUserId);
};
