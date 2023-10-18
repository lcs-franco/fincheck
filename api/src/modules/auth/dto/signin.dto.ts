import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  /**
   * Email do usuário cadastrado
   * @example mail@mail.com
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Senha do usuário cadastrado
   * @example Password@123
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
