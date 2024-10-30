import { IKeystore } from '../interface/keystore.interface';
import { ModelEntity } from 'src/common/serializers/model.serializer';

export class ApiKeyEntity extends ModelEntity implements IKeystore {
  primaryKey: string;
  secondaryKey: string;
  //client: UserEntity;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
