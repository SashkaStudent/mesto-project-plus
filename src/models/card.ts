import mongoose from 'mongoose';
import { IUser } from './user';

export interface ICard {
  _id: string;
  name: string;
  link: string;
  owner: IUser;
  likes: IUser[];
  createdAt: Date;
}

const cardScheme = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<ICard>('Card', cardScheme);
