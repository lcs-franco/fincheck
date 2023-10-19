import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
  /**
   * Nome que o usuário irá cadastrar
   * @example John
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email que o usuário irá cadastrar
   * OBS: Deve ser um email válido
   * @example mail@mail.com
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Senha que o usuário irá cadastrar
   * OBS: A senha deve ter no minimo 8 caracteres
   * @example Senha123
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
