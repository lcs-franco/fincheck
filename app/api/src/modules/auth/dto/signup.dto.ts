import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
  /**
   * Name that the user will register
   * @example John
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email that the user will register
   * OBS: Must be a valid email
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
