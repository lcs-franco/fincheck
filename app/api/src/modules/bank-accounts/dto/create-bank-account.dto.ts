import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { BankAccountType } from '../entities/BankAccount';

export class CreateBankAccountDto {
  /**
   * Bank account name
   * @example Nubank
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Initial account value at registration
   * @example 500
   */
  @IsNumber()
  @IsNotEmpty()
  initialBalance: number;

  /**
   * Type of bank account
   * @example CHECKING
   */
  @IsNotEmpty()
  @IsEnum(BankAccountType)
  type: BankAccountType;

  /**
   * Color of the account, used on front-end
   * OBS: Should be a hexadecimal color
   * @example #fff
   */
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;
}
