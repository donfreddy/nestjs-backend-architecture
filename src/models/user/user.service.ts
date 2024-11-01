import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Keystore } from '../keystore/schemas/keystore.schema';
import { RoleService } from '../role/role.service';
import { KeystoreService } from '../keystore/keystore.service';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private readonly keystoreService: KeystoreService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await this.roleService.findByCode(roleCode);
    if (!role) throw new InternalServerErrorException('Role must be defined');

    user.roles = [role];
    user.createdAt = user.updatedAt = now;
    const createdUser = await this.userModel.create(user);

    const keystore = await this.keystoreService.create(
      createdUser,
      accessTokenKey,
      refreshTokenKey,
    );

    return {
      user: { ...createdUser.toObject(), roles: user.roles },
      keystore: keystore,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email: email })
      .select(
        '+email +password +roles +gender +dob +grade +country +state +city +school +bio +hobbies',
      )
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean()
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
