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
} from '@nestjs/common';
import { BankAccountsService } from './services/bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BankAccountSwaggerDto } from './dto/bank-account-swagger.dto';

@ApiBearerAuth('accessToken')
@ApiTags('bank-accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  //Documentation functions
  @ApiOperation({ description: 'Create bank account' })
  @ApiCreatedResponse({
    description: 'Returned created bank account',
    type: BankAccountSwaggerDto,
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
  //Route function
  create(
    @ActiveUserId() userId: string,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return this.bankAccountsService.create(userId, createBankAccountDto);
  }

  @Get()
  //Documentation functions
  @ApiOperation({ description: 'List all bank accounts by userId' })
  @ApiOkResponse({
    description: 'Returned an array of bank accounts',
    type: [BankAccountSwaggerDto],
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
  //Route function
  findAll(@ActiveUserId() userId: string) {
    return this.bankAccountsService.findAllByUserId(userId);
  }

  @Put(':bankAccountId')
  //Documentation functions
  @ApiOperation({ description: 'Update bank account by userId' })
  @ApiOkResponse({
    description: 'Returned updated bank account',
    type: BankAccountSwaggerDto,
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
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountsService.update(
      userId,
      bankAccountId,
      updateBankAccountDto,
    );
  }

  @Delete(':bankAccountId')
  @HttpCode(204)
  //Documentation functions
  @ApiOperation({ description: 'Delete bank account by userId' })
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
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
  ) {
    return this.bankAccountsService.remove(userId, bankAccountId);
  }
}
