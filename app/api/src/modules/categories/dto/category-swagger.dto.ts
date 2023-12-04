import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'src/modules/transactions/entities/Transaction';

export class CategorySwaggerDto {
  @ApiProperty({ example: '3db00a87-7cef-4447-bf49-54701cecc720' })
  id: string;

  @ApiProperty({ example: '4efe9883-26aa-4d34-9efe-18cf668692db' })
  userId: string;

  @ApiProperty({ example: 'Salary' })
  name: string;

  @ApiProperty({ example: 'salary' })
  icon: string;

  @ApiProperty({ enum: TransactionType })
  type: string;
}
