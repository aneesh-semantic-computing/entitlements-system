import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsInt()
  userId!: number;
}
