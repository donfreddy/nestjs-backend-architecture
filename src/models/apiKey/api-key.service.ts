import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeyEntity } from './serializer/api-key.serializer';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKeyEntity>,
  ) {}

  async findOne(id: number): Promise<ApiKeyEntity> {
    return await this.apiKeyRepo.findOne(id);
  }
}
