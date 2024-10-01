import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  player1: string;

  @IsString()
  player2: string;

  @IsDate()
  @IsOptional()
  matchDate?: Date;

  @IsNumber()
  @IsOptional()
  player1Score?: number;

  @IsNumber()
  @IsOptional()
  player2Score?: number;

  @IsString()
  @IsOptional()
  winner?: string;
}
