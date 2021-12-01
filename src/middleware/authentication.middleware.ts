import { getAccessToken } from '../utils/auth.utils';
import { NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request } from 'express';

export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get token
    const token = getAccessToken(req.headers.authorization);

    try {
      // const decoded = jwt.verify(token, 'secret');
      // req.body.user = decoded;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    // Call next middleware or controller
    next();
  }
}
