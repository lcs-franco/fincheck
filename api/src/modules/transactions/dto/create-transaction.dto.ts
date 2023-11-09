import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/Transaction';

export class CreateTransactionDto {
  /**
   * Id(uuid) of bank account
   * @example e11f1e63-7476-4093-a2c2-6520ba19c092
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  bankAccountId: string;

  /**
   * Id(uuid) of category
   * @example 2fa87bc5-8488-4e8b-84b1-79826aced7d7
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  /**
   * Name of the transaction
   * @example water bill
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Current value of the transaction
   * @example 375
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  /**
   * Date of the transaction
   * OBS: Accepted ISO 8601 UTC formats
   * @example 2023-11-01T00:00:00.00Z
   */
  @IsNotEmpty()
  @IsDateString()
  date: string;

  /**
   * Type of the transaction
   * @example 375
   */
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}
