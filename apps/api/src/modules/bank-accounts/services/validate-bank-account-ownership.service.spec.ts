import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

describe('ValidateBankAccountOwnershipService', () => {
  let validateBankAccountOwnershipService: ValidateBankAccountOwnershipService;
  // Mock bank account repository for testing
  const mockBankAccountsRepository = {
    findFirst: jest.fn(),
  };

  // Set up the testing module
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateBankAccountOwnershipService,
        {
          provide: BankAccountsRepository,
          useValue: mockBankAccountsRepository,
        },
      ],
    }).compile();

    validateBankAccountOwnershipService =
      module.get<ValidateBankAccountOwnershipService>(
        ValidateBankAccountOwnershipService,
      );
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(validateBankAccountOwnershipService).toBeDefined();
  });

  describe('validate bank account ownership', () => {
    it('should not throw NotFoundException for valid ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';

      // Mock BankAccountsRepository to resolve with a truthy value (valid ownership)
      mockBankAccountsRepository.findFirst.mockResolvedValue({});

      await expect(
        validateBankAccountOwnershipService.validate(
          mockUserId,
          mockBankAccountId,
        ),
      ).resolves.not.toThrow();

      expect(mockBankAccountsRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockBankAccountId, userId: mockUserId },
      });
    });

    it('should throw NotFoundException for invalid ownership', async () => {
      // Mock data
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';

      // Configure the mock BankAccountsRepository to resolve with a falsy value (invalid ownership)
      mockBankAccountsRepository.findFirst.mockResolvedValue(null);

      await expect(
        validateBankAccountOwnershipService.validate(
          mockUserId,
          mockBankAccountId,
        ),
      ).rejects.toThrowError(NotFoundException);

      expect(mockBankAccountsRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockBankAccountId, userId: mockUserId },
      });
    });
  });
});
