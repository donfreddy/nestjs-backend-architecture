import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Contains critical information on the user
  public async findById(id: number): Promise<User> {
    return this.findOne(
      { id, status: true },
      { select: ['email', 'password', 'roles'], relations: ['roles'] },
    );
  }

  public findByEmail(email: string): Promise<User> {
    return this.findOne(
      { email, status: true },
      {
        select: ['email', 'password', 'roles'],
        join: { alias: 'user', leftJoinAndSelect: { roles: 'user.roles' } },
        // where: { status: true, email },
      },
    );
  }

  public findProfileById(id: number): Promise<User> {
    return this.findOne(
      { id, status: true },
      {
        select: ['roles'],
        join: { alias: 'user', leftJoinAndSelect: { roles: 'user.roles' } },
        // where: { status: true, email },
      },
    );
  }

  public findPublicProfileById(id: number) {
    // Handle method here
  }

  public createUser(user: User, accessTokenKey: string, refreshTokenKey: string, roleCode: string) {
    //   // Handle method here
  }

  public updateUser(user: User, accessTokenKey: string, refreshTokenKey: string) {
    //   // Handle method here
  }

  public updateInfo(user: User): Promise<UpdateResult> {
    user.updatedAt = new Date();
    return this.update({ id: user.id }, { ...user });
  }
}
