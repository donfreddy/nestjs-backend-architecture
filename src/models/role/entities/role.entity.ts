import { IApiKey } from '../interface/api-key.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleCode } from '../role.enum';

@Entity({ name: 'roles' })
export class Role implements IApiKey {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: [RoleCode.LEARNER, RoleCode.WRITER, RoleCode.EDITOR, RoleCode.ADMIN],
  })
  code: string;

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
