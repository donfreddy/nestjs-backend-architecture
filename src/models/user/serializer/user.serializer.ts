import { ModelEntity } from 'src/common/serializers/model.serializer';
import { IApiKey } from '../interface/user.interface';

export class ApiKeyEntity extends ModelEntity implements IApiKey {
  key: string;
  version: number;
  metadata: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
