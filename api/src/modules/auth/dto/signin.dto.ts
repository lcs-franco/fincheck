import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
   * OBS: A senha deve ter no minimo 8 caracteres
   * @example Senha123
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
