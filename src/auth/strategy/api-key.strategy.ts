import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor() {
    super({
      headerKey: 'x-api-key',
      headerPrefix: '',
      keyExtractor: (req: any) => req.headers['x-api-key'],
    });
  }

  async validate(apiKey: string, done: (err: any, user: any) => void) {
    if (!apiKey) {
      return done(new HttpException('API key is missing', HttpStatus.UNAUTHORIZED), false);
    }

    // Find api key in database
    // const apiKey = await ApiKey.findOne({ where: { key: apiKey } });

    if (apiKey !== 'secret') {
      return done(new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED), false);
    }
    return done(null, apiKey);
  }
}
