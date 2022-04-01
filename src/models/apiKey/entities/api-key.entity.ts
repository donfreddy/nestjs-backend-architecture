import { IApiKey } from '../interface/api-key.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'api_keys' })
export class ApiKey implements IApiKey {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 1024, unique: true })
  key: string;

  @Column({ length: 100 })
  version: number;

  @Column()
  metadata: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatetAt: Date;
}
