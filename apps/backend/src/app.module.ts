import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ParseModule } from './parse/parse.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ParseModule,
    ExpensesModule,
  ],
})
export class AppModule {}
