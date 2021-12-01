/* eslint-disable @typescript-eslint/no-unused-vars */

import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Contains critical information on the user
  public findById(id: number): Promise<User | null> {
    return this.findOne(
      { id, status: true },
      { select: ['email', 'password', 'roles'], join: { alias: 'roles' } },
    );
  }

  public findByEmail(email: string) {
    // Handle method here
  }

  public findProfileById(id: number) {
    // Handle method here
  }

  public findPublicProfileById(id: number) {
    // Handle method here
  }

  // public create(user: User, accessTokenKey: string, refreshTokenKey: string, roleCode: string) {
  //   // Handle method here
  // }

  // public update(user: User, accessTokenKey: string, refreshTokenKey: string) {
  //   // Handle method here
  // }

  public updateInfo(user: User) {
    // Handle method here
  }
}
