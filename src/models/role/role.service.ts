import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private readonly model: Model<Role>) {}

  async findByCode(code: string): Promise<Role | null> {
    return this.model.findOne({ code: code, status: true }).select('+code').lean().exec();
  }

  async findByCodes(codes: string[]): Promise<Role[]> {
    return this.model
      .find({ code: { $in: codes }, status: true })
      .lean()
      .exec();
  }
}
