import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccessRequestDto {
  @IsNotEmpty()
  @IsString()
  symbol!: string;

  @IsBoolean()
  hourly!: boolean;

  @IsBoolean()
  daily!: boolean;

  @IsBoolean()
  monthly!: boolean;
}
