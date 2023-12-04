import { ApiProperty } from '@nestjs/swagger';
import { BankAccountType } from '../entities/BankAccount';

export class BankAccountSwaggerDto {
  @ApiProperty({ example: '4cb4f457-9217-4dfc-8f88-0386c79ba409' })
  id: string;

  @ApiProperty({ example: '4efe9883-26aa-4d34-9efe-18cf668692db' })
  userId: string;

  @ApiProperty({ example: 'Nubank' })
  name: string;

  @ApiProperty()
  initialBalance: number;

  @ApiProperty({ enum: BankAccountType })
  type: string;

  @ApiProperty({ example: '#fff' })
  color: string;
}
