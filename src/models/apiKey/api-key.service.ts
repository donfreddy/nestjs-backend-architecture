import { Injectable } from '@nestjs/common';
import { ApiKey } from './schemas/api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ApiKeyService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>) {}

  async findByKey(key: string): Promise<ApiKey | null> {
    return this.apiKeyModel.findOne({ key: key, status: true }).lean().exec();
  }
}
