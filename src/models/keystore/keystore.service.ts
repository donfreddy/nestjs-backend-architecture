import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Keystore } from './schemas/keystore.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class KeystoreService {
  constructor(@InjectModel(Keystore.name) private model: Model<Keystore>) {}

  async create(client: User, primaryKey: string, secondaryKey: string): Promise<Keystore> {
    const now = new Date();

    const createdKeystore = new this.model({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
      createdAt: now,
      updatedAt: now,
    });

    const keystore = await createdKeystore.save();
    return keystore.toObject();
  }

  async find(client: User, primaryKey: string, secondaryKey: string): Promise<Keystore | null> {
    return this.model
      .findOne({
        client: client,
        primaryKey: primaryKey,
        secondaryKey: secondaryKey,
      })
      .lean()
      .exec();
  }

  async findFoyKey(client: User, key: string): Promise<Keystore | null> {
    return this.model
      .findOne({
        client: client,
        primaryKey: key,
        status: true,
      })
      .lean()
      .exec();
  }

  async remove(id: Types.ObjectId): Promise<Keystore | null> {
    return this.model.findByIdAndDelete(id).lean().exec();
  }

  async removeAllForClient(client: User) {
    return this.model.deleteMany({ client: client }).exec();
  }
}
