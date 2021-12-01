import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface Role {
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, length: 100 })
  name: string;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'profile_pic_url', nullable: true })
  profilePicUrl: string;

  roles: Role[];

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
