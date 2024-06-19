import { IsBoolean, IsString, IsNotEmpty, IsOptional} from 'class-validator';

export class UpdateAccessDto {
  @IsNotEmpty()
  @IsString()
  readonly userId!: number;

  @IsNotEmpty()
  @IsString()
  readonly symbol!: string;

  @IsBoolean()
  readonly hourly!: boolean;

  @IsBoolean()
  readonly daily!: boolean;

  @IsBoolean()
  readonly monthly!: boolean;

  @IsOptional()
  readonly periodFrom!: Date;
  
  @IsOptional()
  readonly periodTo!: Date;
}
