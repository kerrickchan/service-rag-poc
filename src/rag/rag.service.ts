import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Document,
  Ollama,
  Settings,
  SimpleDirectoryReader,
  VectorStoreIndex,
} from 'llamaindex';

@Injectable()
export class RagService implements OnModuleInit {
  private queryEngine: any;
  private index: VectorStoreIndex;

  async onModuleInit() {
    await this.initializeRag();
  }

  private async initializeRag() {
    const ollama = new Ollama({
      model: 'llama3.1:8b',
    });

    // Use Ollama for both LLM and Embed Model
    Settings.llm = ollama;
    Settings.embedModel = ollama;

    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: 'path/to/your/documents',
    });

    this.index = await VectorStoreIndex.fromDocuments(documents);

    this.queryEngine = this.index.asQueryEngine();
  }

  async query(question: string): Promise<string> {
    const response = await this.queryEngine.query({
      query: question,
    });
    return response.response;
  }

  async addDocument(title: string, content: string): Promise<void> {
    const newDocument = new Document({ text: content, metadata: { title } });
    await this.index.insert(newDocument);
    // Refresh the query engine to include the new document
    this.queryEngine = this.index.asQueryEngine();
  }
}
