import { Types } from 'mongoose';

export interface IRole {
  //_id: Types.ObjectId;
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
