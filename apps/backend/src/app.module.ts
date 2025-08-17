import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ParseModule } from './parse/parse.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ParseModule,
  ],
})
export class AppModule {}
