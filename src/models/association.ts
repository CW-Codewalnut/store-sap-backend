import Plant from './plant';
import User from './user';
import UserPlant from './user-plant';

User.belongsToMany(Plant, {
  through: UserPlant,
  foreignKey: 'userId',
});

Plant.belongsToMany(User, {
  through: UserPlant,
  foreignKey: 'plantId',
});
