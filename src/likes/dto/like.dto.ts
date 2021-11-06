import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  @Min(1)
  movieId: number;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}
