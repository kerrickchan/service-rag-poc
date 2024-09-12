import { Controller, Get, Post, Query, Body } from '@nestjs/common';

import { RagService } from './rag.service';
import { AddDocumentDto } from './dto/add-document.dto';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Get('query')
  async query(@Query('question') question: string): Promise<string> {
    return this.ragService.query(question);
  }

  @Post('document')
  async addDocument(@Body() document: AddDocumentDto): Promise<string> {
    await this.ragService.addDocument(document.title, document.content);
    return 'Document added successfully';
  }
}
