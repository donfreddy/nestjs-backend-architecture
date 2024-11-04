import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Keystore } from '../keystore/schemas/keystore.schema';
import { RoleService } from '../role/role.service';
import { KeystoreService } from '../keystore/keystore.service';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private readonly keystoreService: KeystoreService,
    @InjectModel(User.name) private model: Model<User>,
  ) {}

  async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await this.roleService.findByCode(roleCode);
    if (!role) throw new InternalServerErrorException({ key: 'auth.error.role_must_be_defined' });

    user.roles = [role];
    user.createdAt = user.updatedAt = now;
    const createdUser = await this.model.create(user);

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

  // contains critical information of the user
  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.model
      .findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean()
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model
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
    return this.model.find().exec();
  }
}
