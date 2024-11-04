import { BadRequestException, ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Header } from '../helpers';
import { PublicRequest } from '../../types/app-request';
import { ApiKeyService } from '../../models/apiKey/api-key.service';

@Injectable()
export class ApikeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async use(req: PublicRequest, res: Response, next: NextFunction) {
    // Get API key from headers
    const key = req.headers[Header.API_KEY]?.toString();

    if (!key) throw new ForbiddenException({ key: 'auth.error.permission_denied' });

    const apiKey = await this.apiKeyService.findByKey(key);
   // if (!apiKey) throw new ForbiddenException({ key: 'auth.error.permission_denied' });
    if (!apiKey) throw new BadRequestException({ key: 'auth.error.permission_denied' });

    req.apiKey = apiKey;

    // Call next if the middleware is successful
    next();
  }
}
