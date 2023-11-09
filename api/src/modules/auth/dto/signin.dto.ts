import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  /**
   * Email that the user will register
   * @example mail@mail.com
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Password that the user will register
   * OBS: The password must be at least 8 characters long
   * @example Potato69
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
