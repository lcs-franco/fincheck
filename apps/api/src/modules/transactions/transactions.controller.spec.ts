import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from './entities/Transaction';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;

  const mockTransactionsService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCreateTransactionDto: CreateTransactionDto = {
        bankAccountId: 'mocked-bank-account-id',
        categoryId: 'mocked-category-id',
        date: '2024-01-01T00:00:00.00Z',
        name: 'New Transaction',
        type: TransactionType.INCOME,
        value: 100,
      };

      await transactionsController.create(mockUserId, mockCreateTransactionDto);

      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        mockUserId,
        mockCreateTransactionDto,
      );
    });
  });

  describe('findAll', () => {
    it('should find all transactions', async () => {
      const mockUserId = 'mocked-user-id';
      const mockFilters = {
        month: 1,
        year: 2024,
        bankAccountId: 'mocked-bank-account-id',
        type: TransactionType.EXPENSE,
      };

      await transactionsController.findAll(
        mockUserId,
        mockFilters.month,
        mockFilters.year,
        mockFilters.bankAccountId,
        mockFilters.type,
      );

      expect(mockTransactionsService.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
        mockFilters,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';
      const mockUpdateTransactionDto: UpdateTransactionDto = {
        bankAccountId: 'updated-bank-account-id',
        categoryId: 'updated-category-id',
        date: '2024-02-01T00:00:00.00Z',
        name: 'Updated Transaction',
        type: TransactionType.EXPENSE,
        value: 150,
      };

      await transactionsController.update(
        mockUserId,
        mockTransactionId,
        mockUpdateTransactionDto,
      );

      expect(mockTransactionsService.update).toHaveBeenCalledWith(
        mockUserId,
        mockTransactionId,
        mockUpdateTransactionDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';

      await transactionsController.remove(mockUserId, mockTransactionId);

      expect(mockTransactionsService.remove).toHaveBeenCalledWith(
        mockUserId,
        mockTransactionId,
      );
    });
  });
});
