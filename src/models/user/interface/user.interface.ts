import { Types } from 'mongoose';
import { IRole } from '../../role/interface/role.interface';

export default interface IUser {
  _id: Types.ObjectId;
  name?: string;
  email?: string;
  password?: string;
  profilePicUrl?: string;
  roles: IRole[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
