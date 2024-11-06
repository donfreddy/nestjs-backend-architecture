import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as _ from 'lodash';
import { Keystore } from '../keystore/schemas/keystore.schema';
import { RoleService } from '../role/role.service';
import { KeystoreService } from '../keystore/keystore.service';
import { LoginDto } from '../../auth/dto/auth.dto';
import { hashPassword } from '../../common/helpers';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return this.model
      .updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }

  async findPrivateProfileById(id: Types.ObjectId): Promise<User | null> {
    return this.model
      .findOne({ _id: id, status: true })
      .select('+email')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  async assign(inputs: LoginDto): Promise<Partial<User>> {
    const user = await this.findByEmail(inputs.email);
    if (!user) throw new BadRequestException({ key: 'auth.error.user_not_exist' });

    const passwordHash = await hashPassword(inputs.password);

    await this.updateInfo({ _id: user._id, password: passwordHash } as User);

    await this.keystoreService.removeAllForClient(user);

    return _.pick(user, ['_id', 'name', 'email']);
  }

  async getPrivateProfile(userId: Types.ObjectId): Promise<Partial<User>> {
    const user = await this.findPrivateProfileById(userId);
    if (!user) throw new BadRequestException({ key: 'auth.error.user_not_registered' });

    return _.pick(user, ['name', 'email', 'profilePicUrl', 'roles']);
  }

  async updateProfile(userId: Types.ObjectId, inputs: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.findPrivateProfileById(userId);
    if (!user) throw new BadRequestException({ key: 'auth.error.user_not_registered' });

    const { name, profile_pic_url: profilePicUrl } = inputs;

    if (name) user.name = name;
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;

    await this.updateInfo(user);
    return _.pick(user, ['name', 'profilePicUrl']);
  }

  async getPublicProfile(userId: Types.ObjectId): Promise<Partial<User>> {
    const user = await this.findPrivateProfileById(userId);
    if (!user) throw new BadRequestException({ key: 'auth.error.user_not_registered' });

    return _.pick(user, ['name', 'profilePicUrl']);
  }
}
