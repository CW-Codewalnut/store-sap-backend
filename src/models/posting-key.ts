import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PostingKeyModel from '../interfaces/masters/postingKey.interface';

const PostingKey = sequelize.define<PostingKeyModel>('posting_key', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  postingKey: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM('Credit', 'Debit'),
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  postingKeyReversalId: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
});

export default PostingKey;
