import { IsEmail, IsNotEmpty } from 'class-validator';

export class RentalDto {
  @IsNotEmpty()
  movieId: number;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}
