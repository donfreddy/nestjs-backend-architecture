import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class ApikeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get API key from headers
    const apiKey = req.headers['x-api-key'].toString();

    if (!apiKey) {
      throw new HttpException('API key is missing', HttpStatus.UNAUTHORIZED);
    }

    if (apiKey !== 'secret') {
      throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
    }

    // Call next if the middleware is successful
    next();
  }
}
