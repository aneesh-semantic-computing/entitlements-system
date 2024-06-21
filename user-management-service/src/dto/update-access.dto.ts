import { IsBoolean, IsString, IsNotEmpty, IsOptional} from 'class-validator';

export class UpdateAccessDto {
  @IsNotEmpty()
  @IsString()
  readonly userId!: number;

  @IsNotEmpty()
  @IsString()
  readonly symbol!: string;

  @IsBoolean()
  @IsOptional()
  readonly hourly!: boolean;

  @IsBoolean()
  @IsOptional()
  readonly daily!: boolean;

  @IsBoolean()
  @IsOptional()
  readonly monthly!: boolean;

  @IsOptional()
  readonly periodFrom!: Date;
  
  @IsOptional()
  readonly periodTo!: Date;
}
