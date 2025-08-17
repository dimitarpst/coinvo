import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ParseModule } from './parse/parse.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ParseModule],
})
export class AppModule {}
