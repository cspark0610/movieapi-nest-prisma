import { IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @Min(1)
  rentalPrice: number;

  @IsNotEmpty()
  @Min(1)
  salePrice: number;

  @IsNotEmpty()
  available: boolean;
}
