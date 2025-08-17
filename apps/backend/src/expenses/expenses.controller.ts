import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  @Get()
  async findAll() {
    return this.expenses.findAll();
  }

  @Post()
  async create(@Body() dto: CreateExpenseDto) {
    return this.expenses.create(dto);
  }
}
