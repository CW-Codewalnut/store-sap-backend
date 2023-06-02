import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PostingKeyModel
  extends Model<
    InferAttributes<PostingKeyModel>,
    InferCreationAttributes<PostingKeyModel>
  > {
  id: string;
  postingKey: number;
  description: string;
  accountType: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default PostingKeyModel;
