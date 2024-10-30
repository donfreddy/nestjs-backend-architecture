import { ModelEntity } from 'src/common/serializers/model.serializer';
import { IApiKey } from '../../apiKey/interface/api-key.interface';
//import { IApiKey } from '../interface/role.interface';

export class ApiKeyEntity extends ModelEntity implements IApiKey {
  key: string;
  version: number;
  metadata: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
