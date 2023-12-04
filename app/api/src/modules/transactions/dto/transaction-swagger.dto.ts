import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/Transaction';

export class TransactionSwaggerDto {
  @ApiProperty({ example: '1e937572-63ce-48f1-95d9-e2622d5687d2' })
  id: string;

  @ApiProperty({ example: '4efe9883-26aa-4d34-9efe-18cf668692db' })
  userId: string;

  @ApiProperty({ example: '4cb4f457-9217-4dfc-8f88-0386c79ba409' })
  bankAccountId: string;

  @ApiProperty({ example: '149565af-d4af-4810-858c-87a96132329e' })
  categoryId: string;

  @ApiProperty({ example: 'Water bill' })
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;
}
