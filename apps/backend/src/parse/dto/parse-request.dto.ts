import { IsString } from 'class-validator';

export class ParseRequestDto {
  @IsString()
  text: string;
}
