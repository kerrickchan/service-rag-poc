import { Test, TestingModule } from '@nestjs/testing';

import { RagController } from './rag.controller';
import { RagService } from './rag.service';

describe('RagController', () => {
  let controller: RagController;
  let service: RagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RagController],
      providers: [
        {
          provide: RagService,
          useValue: {
            query: jest.fn().mockResolvedValue('Mocked response'),
            addDocument: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<RagController>(RagController);
    service = module.get<RagService>(RagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('query', () => {
    it('should return a response from the service', async () => {
      const result = await controller.query('test question');
      expect(result).toBe('Mocked response');
      expect(service.query).toHaveBeenCalledWith('test question');
    });
  });

  describe('addDocument', () => {
    it('should add a new document', async () => {
      const dto = { title: 'Test Title', content: 'Test Content' };
      const result = await controller.addDocument(dto);
      expect(result).toBe('Document added successfully');
      expect(service.addDocument).toHaveBeenCalledWith(
        'Test Title',
        'Test Content',
      );
    });
  });
});
