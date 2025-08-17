import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        amount: new Prisma.Decimal(dto.amount),
        currency: dto.currency,
        category: dto.category,
        date: new Date(dto.date),
        note: dto.note ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
