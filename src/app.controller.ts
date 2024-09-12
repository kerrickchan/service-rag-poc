import { Controller, Get } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { AppService } from './app.service';
import { HealthStatusDto } from './health-status.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthRest(): HealthStatusDto {
    return this.appService.check();
  }
}

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => HealthStatusDto, { name: 'health' })
  getHealthGraphQL() {
    return this.appService.check();
  }
}
