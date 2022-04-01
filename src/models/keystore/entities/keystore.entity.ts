import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IKeystore } from '../interface/keystore.interface';

@Entity({ name: 'keystores' })
export class Keysote implements IKeystore {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  primaryKey: string;

  @Column()
  secondaryKey: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'client' })
  client: UserEntity;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatetAt: Date;
}
