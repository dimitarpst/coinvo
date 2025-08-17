import { Injectable } from '@nestjs/common';
import { Prisma, Expense as ExpenseRow } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

type ApiExpense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note?: string | null;
  createdAt: string;
};

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpenseDto): Promise<ApiExpense> {
    const row = await this.prisma.expense.create({
      data: {
        amount: new Prisma.Decimal(dto.amount),
        currency: dto.currency,
        category: dto.category,
        date: new Date(dto.date),
        note: dto.note ?? null,
      },
    });
    return this.serialize(row);
  }

  async findAll(): Promise<ApiExpense[]> {
    const rows = await this.prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map(this.serialize);
  }

  private serialize = (row: ExpenseRow): ApiExpense => ({
    id: row.id,
    amount: (row.amount as unknown as Prisma.Decimal).toNumber(),
    currency: row.currency,
    category: row.category,
    date: row.date.toISOString(),
    note: row.note,
    createdAt: row.createdAt.toISOString(),
  });
}
