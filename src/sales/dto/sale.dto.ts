import { IsEmail, IsNotEmpty } from 'class-validator';

export class SaleDto {
  @IsNotEmpty()
  movieId: number;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}
