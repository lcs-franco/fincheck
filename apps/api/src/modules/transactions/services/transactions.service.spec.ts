import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { TransactionsService } from './transactions.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionType } from '../entities/Transaction';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  const mockTransactionsRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockValidateBankAccountOwnershipService = {
    validate: jest.fn(),
  };
  const mockValidateCategoryOwnershipService = {
    validate: jest.fn(),
  };
  const mockValidateTransactionOwnershipService = {
    validate: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
        {
          provide: ValidateBankAccountOwnershipService,
          useValue: mockValidateBankAccountOwnershipService,
        },
        {
          provide: ValidateCategoryOwnershipService,
          useValue: mockValidateCategoryOwnershipService,
        },
        {
          provide: ValidateTransactionOwnershipService,
          useValue: mockValidateTransactionOwnershipService,
        },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  //Helper function
  function mockTransactionDto(
    overrides: Partial<CreateTransactionDto> = {},
  ): CreateTransactionDto {
    return {
      bankAccountId: 'mocked-bank-account-id',
      categoryId: 'mocked-category-id',
      date: '2024-01-01T00:00:00.00Z',
      name: 'New Transaction',
      type: TransactionType.INCOME,
      value: 100,
      ...overrides,
    };
  }

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and validate ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCreateTransactionDto = mockTransactionDto();

      // Mock the ownership validation calls
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockResolvedValueOnce({});

      // Configure the mockTransactionsRepository.create method
      mockTransactionsRepository.create.mockResolvedValue({});

      await transactionsService.create(mockUserId, mockCreateTransactionDto);

      expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          bankAccountId: mockCreateTransactionDto.bankAccountId,
          categoryId: mockCreateTransactionDto.categoryId,
          date: mockCreateTransactionDto.date,
          name: mockCreateTransactionDto.name,
          type: mockCreateTransactionDto.type,
          value: mockCreateTransactionDto.value,
        },
      });
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        bankAccountId: mockCreateTransactionDto.bankAccountId,
        categoryId: mockCreateTransactionDto.categoryId,
      });
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalled();
    });

    it('should throw an error if ownership validation fails', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCreateTransactionDto = mockTransactionDto();

      // Mock the ownership validation calls to throw an error
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        transactionsService.create(mockUserId, mockCreateTransactionDto),
      ).rejects.toThrowError(NotFoundException);

      // Ensure validateEntitiesOwnershipSpy was called
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalled();

      // Ensure that mockTransactionsRepository.create was not called
      expect(mockTransactionsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    it('should return transactions for a valid user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockFilters = {
        month: 1,
        year: 2022,
        bankAccountId: 'mocked-bank-account-id',
        type: TransactionType.EXPENSE,
      };
      const mockTransactions = [
        { name: 'Transaction 1' },
        { name: 'Transaction 2' },
      ];

      // Configure the mockTransactionsRepository.findMany method
      mockTransactionsRepository.findMany.mockResolvedValue(mockTransactions);

      const result = await transactionsService.findAllByUserId(
        mockUserId,
        mockFilters,
      );

      // Assert that mockTransactionsRepository.findMany were called with the correct parameters
      expect(mockTransactionsRepository.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          bankAccountId: mockFilters.bankAccountId,
          type: mockFilters.type,
          date: {
            gte: new Date(Date.UTC(mockFilters.year, mockFilters.month)),
            lt: new Date(Date.UTC(mockFilters.year, mockFilters.month + 1)),
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('update', () => {
    it('should update a transaction and validate ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';
      const mockUpdateTransactionDto = mockTransactionDto();

      // Mock the ownership validation calls
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockResolvedValueOnce({});

      // Configure the mockTransactionsRepository.update method
      mockTransactionsRepository.update.mockResolvedValue({});

      await transactionsService.update(
        mockUserId,
        mockTransactionId,
        mockUpdateTransactionDto,
      );

      // Assert that validateEntitiesOwnership and mockTransactionsRepository.update were called with the correct parameters
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        bankAccountId: mockUpdateTransactionDto.bankAccountId,
        categoryId: mockUpdateTransactionDto.categoryId,
        transactionId: mockTransactionId,
      });
      expect(mockTransactionsRepository.update).toHaveBeenCalledWith({
        where: { id: mockTransactionId },
        data: mockUpdateTransactionDto,
      });
    });

    it('should throw an error if ownership validation fails during update', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';
      const mockUpdateTransactionDto = mockTransactionDto();

      // Mock the ownership validation calls to throw an error
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        transactionsService.update(
          mockUserId,
          mockTransactionId,
          mockUpdateTransactionDto,
        ),
      ).rejects.toThrowError(NotFoundException);

      // Ensure validateEntitiesOwnershipSpy was called
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalled();

      // Ensure that mockTransactionsRepository.update was not called
      expect(mockTransactionsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a transaction and validate ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';

      // Mock the ownership validation calls
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockResolvedValueOnce({});

      // Configure the mockTransactionsRepository.delete method
      mockTransactionsRepository.delete.mockResolvedValue({});

      await transactionsService.remove(mockUserId, mockTransactionId);

      // Assert that validateEntitiesOwnership and mockTransactionsRepository.delete were called with the correct parameters
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        transactionId: mockTransactionId,
      });
      expect(mockTransactionsRepository.delete).toHaveBeenCalledWith({
        where: { id: mockTransactionId },
      });
    });

    it('should throw an error if ownership validation fails during remove', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';

      // Mock the ownership validation calls to throw an error
      const validateEntitiesOwnershipSpy = jest
        .spyOn(transactionsService as any, 'validateEntitiesOwnership')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        transactionsService.remove(mockUserId, mockTransactionId),
      ).rejects.toThrowError(NotFoundException);

      // Ensure validateEntitiesOwnershipSpy was called
      expect(validateEntitiesOwnershipSpy).toHaveBeenCalled();

      // Ensure that mockTransactionsRepository.delete was not called
      expect(mockTransactionsRepository.delete).not.toHaveBeenCalled();
    });
  });
});
