import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly apiKey!: string;

  @IsString()
  @IsNotEmpty()
  readonly role!: string;
}
