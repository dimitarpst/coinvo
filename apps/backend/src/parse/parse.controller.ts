// src/parse/parse.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseRequestDto } from './dto/parse-request.dto';
import { ExpenseEntry } from './interfaces/expense-entry.interface';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Post()
  async parse(@Body() dto: ParseRequestDto): Promise<ExpenseEntry[]> {
    return this.parseService.parseText(dto.text);
  }
}
