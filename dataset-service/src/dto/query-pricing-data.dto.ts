import { IsString, IsNotEmpty } from 'class-validator';

export class QueryPricingDataDto {
  @IsNotEmpty()
  @IsString()
  apiKey!: string;

  @IsNotEmpty()
  @IsString()
  symbol!: string;

  @IsNotEmpty()
  @IsString()
  frequency!: string;
}
