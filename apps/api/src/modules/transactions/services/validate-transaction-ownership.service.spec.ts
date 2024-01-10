import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';

describe('ValidateCategoryOwnershipService', () => {
  let validateTransactionOwnershipService: ValidateTransactionOwnershipService;
  // Mock transaction repository for testing
  const mockTransactionsRepository = {
    findFirst: jest.fn(),
  };

  // Set up the testing module
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateTransactionOwnershipService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    validateTransactionOwnershipService =
      module.get<ValidateTransactionOwnershipService>(
        ValidateTransactionOwnershipService,
      );
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(validateTransactionOwnershipService).toBeDefined();
  });

  describe('validate transaction ownership', () => {
    it('should not throw NotFoundException for valid ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';

      // Mock TransactionsRepository to resolve with a truthy value (valid ownership)
      mockTransactionsRepository.findFirst.mockResolvedValue({});

      await expect(
        validateTransactionOwnershipService.validate(
          mockUserId,
          mockTransactionId,
        ),
      ).resolves.not.toThrow();

      expect(mockTransactionsRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockTransactionId, userId: mockUserId },
      });
    });

    it('should throw NotFoundException for invalid ownership', async () => {
      // Mock data
      const mockUserId = 'mocked-user-id';
      const mockTransactionId = 'mocked-transaction-id';

      // Configure the mock TransactionsRepository to resolve with a falsy value (invalid ownership)
      mockTransactionsRepository.findFirst.mockResolvedValue(null);

      await expect(
        validateTransactionOwnershipService.validate(
          mockUserId,
          mockTransactionId,
        ),
      ).rejects.toThrowError(NotFoundException);

      expect(mockTransactionsRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockTransactionId, userId: mockUserId },
      });
    });
  });
});
