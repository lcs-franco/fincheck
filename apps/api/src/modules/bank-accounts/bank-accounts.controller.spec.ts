import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './services/bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { BankAccountType } from './entities/BankAccount';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

describe('BankAccountsController', () => {
  let bankAccountsController: BankAccountsController;

  const mockBankAccountsService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountsController],
      providers: [
        {
          provide: BankAccountsService,
          useValue: mockBankAccountsService,
        },
      ],
    }).compile();

    bankAccountsController = module.get<BankAccountsController>(
      BankAccountsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bankAccountsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a bank account', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCreateBankAccountDto: CreateBankAccountDto = {
        name: 'New Bank Account',
        type: BankAccountType.CHECKING,
        initialBalance: 100,
        color: '#fff',
      };

      await bankAccountsController.create(mockUserId, mockCreateBankAccountDto);

      expect(mockBankAccountsService.create).toHaveBeenCalledWith(
        mockUserId,
        mockCreateBankAccountDto,
      );
    });
  });

  describe('findAll', () => {
    it('should find all transactions', async () => {
      const mockUserId = 'mocked-user-id';

      await bankAccountsController.findAll(mockUserId);

      expect(mockBankAccountsService.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';
      const mockUpdateBankAccountDto: UpdateBankAccountDto = {
        name: 'New Bank Account',
        type: BankAccountType.CHECKING,
        initialBalance: 100,
        color: '#fff',
      };

      await bankAccountsController.update(
        mockUserId,
        mockBankAccountId,
        mockUpdateBankAccountDto,
      );

      expect(mockBankAccountsService.update).toHaveBeenCalledWith(
        mockUserId,
        mockBankAccountId,
        mockUpdateBankAccountDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';

      await bankAccountsController.remove(mockUserId, mockBankAccountId);

      expect(mockBankAccountsService.remove).toHaveBeenCalledWith(
        mockUserId,
        mockBankAccountId,
      );
    });
  });
});
