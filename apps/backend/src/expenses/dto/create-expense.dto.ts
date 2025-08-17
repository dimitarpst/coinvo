import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount!: number; // send number from client

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsISO8601()
  date!: string; // ISO date string; backend converts to Date

  @IsOptional()
  @IsString()
  note?: string;
}
