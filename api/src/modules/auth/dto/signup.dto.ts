import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsEmail,
} from 'class-validator';

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
   * OBS: Deve ser uma senha forte (8 caracteres, letras maisculas, minusculas, números e simbolos)
   * @example Password@123
   */
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {},
    {
      message:
        'A senha deve conter no minimo 8 caracteres, letras maiusculas, minusculas, números e simbolos',
    },
  )
  password: string;
}
