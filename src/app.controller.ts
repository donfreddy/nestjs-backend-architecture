import { Controller, Get } from '@nestjs/common';
import { configService } from './config/config.service';
import { ApiResponse } from './common/decorators';

@Controller()
export class AppController {
  @Get()
  @ApiResponse({ key: 'common.success' })
  getHello() {
    return {
      project: 'NestJS Backend Architecture',
      description: 'The architecture of a NodeJS backend application using NestJS framework',
      github_repo: 'https://github.com/donfreddy/nestjs-backend-architecture',
      version: '1.0.0',
      api_version: 'v1',
      license: 'MIT',
      documentation: 'https://documenter.getpostman.com/view/9815708/2sAY4vghgt',
      status: 'active',
      environment: configService.getNodeEnv(),
      author: {
        name: 'Don Freddy',
        email: 'freddytamwo@gmail.com',
        github: 'https://github.com/donfreddy',
      },
      is_open_source: true,
      contributors: null, // Add your name here
      inspired_by: {
        name: 'Janishar Ali',
        project_name: 'NodeJS Backend Architecture Typescript',
        project_url: 'https://github.com/janishar/nodejs-backend-architecture-typescript',
      },
      project_started: '2021-12-01T20:04:00.587Z',
      last_updated: '2024-10-30T18:25:00.587Z',
    };
  }
}
