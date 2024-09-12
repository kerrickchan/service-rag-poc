import { Test, TestingModule } from '@nestjs/testing';
import { RagService } from './rag.service';
import {
  Document,
  Ollama,
  Settings,
  SimpleDirectoryReader,
  VectorStoreIndex,
} from 'llamaindex';

jest.mock('llamaindex');

describe('RagService', () => {
  let service: RagService;
  let mockQueryEngine: jest.Mocked<any>;
  let mockIndex: jest.Mocked<any>;
  let mockOllama: jest.Mocked<any>;

  beforeEach(async () => {
    mockQueryEngine = {
      query: jest.fn().mockResolvedValue({ response: 'Mocked response' }),
    };

    mockIndex = {
      asQueryEngine: jest.fn().mockReturnValue(mockQueryEngine),
      insert: jest.fn().mockResolvedValue(undefined),
    };

    mockOllama = {
      // Add any necessary mock methods for Ollama
    };

    (VectorStoreIndex.fromDocuments as jest.Mock).mockResolvedValue(mockIndex);
    (SimpleDirectoryReader.prototype.loadData as jest.Mock).mockResolvedValue([
      { text: 'Document 1' },
      { text: 'Document 2' },
    ]);
    (Ollama as unknown as jest.Mock).mockImplementation(() => mockOllama);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RagService],
    }).compile();

    service = module.get<RagService>(RagService);
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize the RAG system', () => {
      expect(Ollama).toHaveBeenCalledWith({
        model: 'llama3.1:8b',
      });
      expect(Settings.llm).toBe(mockOllama);
      expect(Settings.embedModel).toBe(mockOllama);
      expect(SimpleDirectoryReader.prototype.loadData).toHaveBeenCalledWith({
        directoryPath: 'path/to/your/documents',
      });
      expect(VectorStoreIndex.fromDocuments).toHaveBeenCalled();
      expect(mockIndex.asQueryEngine).toHaveBeenCalled();
    });
  });

  describe('query', () => {
    it('should return a response from the query engine', async () => {
      const question = 'What is the meaning of life?';
      const result = await service.query(question);
      expect(result).toBe('Mocked response');
      expect(mockQueryEngine.query).toHaveBeenCalledWith({
        query: question,
      });
    });
  });

  describe('addDocument', () => {
    it('should add a new document to the index', async () => {
      const title = 'Test Document';
      const content = 'This is a test document content.';
      await service.addDocument(title, content);

      expect(Document).toHaveBeenCalledWith({
        text: content,
        metadata: { title },
      });
      expect(mockIndex.insert).toHaveBeenCalled();
      expect(mockIndex.asQueryEngine).toHaveBeenCalled();
    });
  });
});
