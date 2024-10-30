import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { configService } from '../config/config.service';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const db = configService.getDB();
    const userCredentials = db.user ? `${db.user}:${db.password}@` : '';
    return {
      uri: `mongodb://${userCredentials}${db.host}:${db.port}/${db.name}`,
      dbName: db.name,
      autoIndex: true,
      minPoolSize: db.minPoolSize,
      maxPoolSize: db.maxPoolSize,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 45000,
    } as MongooseModuleOptions;
  }
}
