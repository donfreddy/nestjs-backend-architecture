import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async findByCode(code: string): Promise<Role | null> {
    return this.roleModel.findOne({ code: code, status: true }).lean().exec();
  }

  async findByCodes(codes: string[]): Promise<Role[]> {
    return this.roleModel
      .find({ code: { $in: codes }, status: true })
      .lean()
      .exec();
  }
}
