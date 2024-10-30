import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const start = Date.now();

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode } = response;
      const duration = `\x1b[33m+${Date.now() - start}ms\x1b[89m`;

      const message = `${method} ${originalUrl} ${statusCode} ${duration}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }
      return this.logger.log(message);
    });
    next();
  }
}
