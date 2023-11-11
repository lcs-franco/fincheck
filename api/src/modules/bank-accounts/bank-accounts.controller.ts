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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
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
    type: BankAccountSwaggerDto,
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
  @ApiOkResponse({ type: [BankAccountSwaggerDto] })
  //Route function
  findAll(@ActiveUserId() userId: string) {
    return this.bankAccountsService.findAllByUserId(userId);
  }

  @Put(':bankAccountId')
  //Documentation functions
  @ApiOperation({ description: 'Update bank account by userId' })
  @ApiOkResponse({ type: BankAccountSwaggerDto })
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
  //Route function
  remove(
    @ActiveUserId() userId: string,
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
  ) {
    return this.bankAccountsService.remove(userId, bankAccountId);
  }
}
