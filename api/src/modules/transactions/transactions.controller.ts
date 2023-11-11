import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { TransactionsService } from './services/transactions.service';
import { OptionalParseUUIDPipe } from 'src/shared/pipes/OptionalParseUUIDPipe';
import { TransactionType } from './entities/Transaction';
import { OptionalParseEnumPipe } from 'src/shared/pipes/OptionalParseEnumPipe';
import { TransactionSwaggerDto } from './dto/transaction-swagger.dto';

@ApiBearerAuth('accessToken')
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  //Documentation functions
  @ApiOperation({ description: 'Create transaction' })
  @ApiCreatedResponse({
    description: 'Returned created transaction',
    type: TransactionSwaggerDto,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
    description: 'UnauthorizedException.',
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: '* not found',
        error: 'Not Found',
      },
    },
    description: 'NotFoundException.',
  })
  //Route function
  create(
    @ActiveUserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  //Documentation functions
  @ApiOperation({ description: 'List all transactions by userId' })
  @ApiQuery({
    name: 'month',
    description: 'In array style, i.e. first month is 0',
  })
  @ApiQuery({ name: 'bankAccountId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiOkResponse({
    description: 'Returned an array of transactions',
    type: [TransactionSwaggerDto],
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
    description: 'UnauthorizedException.',
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
    description: 'BadRequestException.',
  })
  //Route function
  findAll(
    @ActiveUserId() userId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('bankAccountId', OptionalParseUUIDPipe) bankAccountId?: string,
    @Query('type', new OptionalParseEnumPipe(TransactionType))
    type?: TransactionType,
  ) {
    return this.transactionsService.findAllByUserId(userId, {
      month,
      year,
      bankAccountId,
      type,
    });
  }

  @Put(':transactionId')
  //Documentation functions
  @ApiOperation({ description: 'Update transaction by userId' })
  @ApiOkResponse({
    description: 'Returned updated transaction',
    type: TransactionSwaggerDto,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
    description: 'UnauthorizedException.',
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: '* not found',
        error: 'Not Found',
      },
    },
    description: 'NotFoundException.',
  })
  //Route function
  update(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      userId,
      transactionId,
      updateTransactionDto,
    );
  }

  @Delete(':transactionId')
  @HttpCode(204)
  //Documentation functions
  @ApiOperation({ description: 'Delete transaction by userId' })
  @ApiNoContentResponse({ description: 'No body returned for response' })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
    description: 'UnauthorizedException.',
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: '* not found',
        error: 'Not Found',
      },
    },
    description: 'NotFoundException.',
  })
  //Route function
  remove(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    return this.transactionsService.remove(userId, transactionId);
  }
}
