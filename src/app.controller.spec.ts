import { Test, TestingModule } from '@nestjs/testing';

import { AppController, AppResolver } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appResolver: AppResolver;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppResolver,
        {
          provide: AppService,
          useValue: {
            check: jest.fn().mockReturnValue({
              status: 'ok',
              timestamp: '2023-09-07T12:00:00Z',
              uptime: 3600,
              memoryUsage:
                '{"rss":"50MB","heapTotal":"30MB","heapUsed":"20MB","external":"10MB"}',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appResolver = app.get<AppResolver>(AppResolver);
    appService = app.get<AppService>(AppService);
  });

  describe('REST - getHealthRest', () => {
    it('should return health status', () => {
      const result = appController.getHealthRest();
      expect(result).toEqual({
        status: 'ok',
        timestamp: '2023-09-07T12:00:00Z',
        uptime: 3600,
        memoryUsage:
          '{"rss":"50MB","heapTotal":"30MB","heapUsed":"20MB","external":"10MB"}',
      });
      expect(appService.check).toHaveBeenCalled();
    });
  });

  describe('GraphQL - getHealthGraphQL', () => {
    it('should return health status', () => {
      const result = appResolver.getHealthGraphQL();
      expect(result).toEqual({
        status: 'ok',
        timestamp: '2023-09-07T12:00:00Z',
        uptime: 3600,
        memoryUsage:
          '{"rss":"50MB","heapTotal":"30MB","heapUsed":"20MB","external":"10MB"}',
      });
      expect(appService.check).toHaveBeenCalled();
    });
  });
});
