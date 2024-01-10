import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';
import { BankAccountType } from '../entities/BankAccount';
import { TransactionType } from 'src/modules/transactions/entities/Transaction';

describe('BankAccountsService', () => {
  let bankAccountsService: BankAccountsService;
  const mockBankAccountsRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockValidateBankAccountOwnershipService = {
    validate: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountsService,
        {
          provide: BankAccountsRepository,
          useValue: mockBankAccountsRepository,
        },
        {
          provide: ValidateBankAccountOwnershipService,
          useValue: mockValidateBankAccountOwnershipService,
        },
      ],
    }).compile();

    bankAccountsService = module.get<BankAccountsService>(BankAccountsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockBankAccountDto(
    overrides: Partial<CreateBankAccountDto> = {},
  ): CreateBankAccountDto {
    return {
      name: 'New Bank Account',
      initialBalance: 1000,
      type: BankAccountType.CHECKING,
      color: '#fff',
      ...overrides,
    };
  }

  it('should be defined', () => {
    expect(bankAccountsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a bank account', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCreateBankAccountDto = mockBankAccountDto();

      // Configure the mockBankAccountsRepository.create method
      mockBankAccountsRepository.create.mockResolvedValue({});

      await bankAccountsService.create(mockUserId, mockCreateBankAccountDto);

      expect(mockBankAccountsRepository.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          ...mockCreateBankAccountDto,
        },
      });
    });
  });

  describe('findAllByUserId', () => {
    it('should return bank accounts with current balance', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccounts = [
        {
          id: 'mocked-bank-account-id-1',
          name: 'Account 1',
          color: '#AAAAAA',
          initialBalance: 500,
          type: BankAccountType.CHECKING,
          transactions: [
            { type: TransactionType.INCOME, value: 200 },
            { type: TransactionType.EXPENSE, value: 100 },
          ],
        },
        {
          id: 'mocked-bank-account-id-2',
          name: 'Account 2',
          color: '#CCCCCC',
          initialBalance: 1000,
          type: BankAccountType.INVESTMENT,
          transactions: [
            { type: TransactionType.INCOME, value: 300 },
            { type: TransactionType.EXPENSE, value: 150 },
          ],
        },
      ];

      // Configure the mockBankAccountsRepository.findMany method
      mockBankAccountsRepository.findMany.mockResolvedValue(mockBankAccounts);

      const result = await bankAccountsService.findAllByUserId(mockUserId);

      // Assert that mockBankAccountsRepository.findMany was called with the correct parameters
      expect(mockBankAccountsRepository.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          transactions: {
            select: {
              value: true,
              type: true,
            },
          },
        },
      });

      // Assert the transformed result with current balance
      expect(result).toEqual([
        {
          id: 'mocked-bank-account-id-1',
          name: 'Account 1',
          color: '#AAAAAA',
          initialBalance: 500,
          type: BankAccountType.CHECKING,
          currentBalance: 600, // (500 + 200) - 100
        },
        {
          id: 'mocked-bank-account-id-2',
          name: 'Account 2',
          color: '#CCCCCC',
          initialBalance: 1000,
          type: BankAccountType.INVESTMENT,
          currentBalance: 1150, // (1000 + 300) - 150
        },
      ]);
    });
  });

  describe('update', () => {
    it('should update a bank account and validate ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';
      const mockUpdateBankAccountDto = mockBankAccountDto();

      // Mock the ownership validation calls
      mockValidateBankAccountOwnershipService.validate.mockResolvedValueOnce(
        {},
      );

      // Configure the mockBankAccountsRepository.update method
      mockBankAccountsRepository.update.mockResolvedValue({});

      await bankAccountsService.update(
        mockUserId,
        mockBankAccountId,
        mockUpdateBankAccountDto,
      );

      // Assert that validateBankAccountOwnership and mockBankAccountsRepository.update were called with the correct parameters
      expect(
        mockValidateBankAccountOwnershipService.validate,
      ).toHaveBeenCalledWith(mockUserId, mockBankAccountId);
      expect(mockBankAccountsRepository.update).toHaveBeenCalledWith({
        where: { id: mockBankAccountId },
        data: mockUpdateBankAccountDto,
      });
    });

    it('should throw an error if ownership validation fails during update', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';
      const mockUpdateBankAccountDto = mockBankAccountDto();

      // Mock the ownership validation calls to throw an error
      mockValidateBankAccountOwnershipService.validate.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        bankAccountsService.update(
          mockUserId,
          mockBankAccountId,
          mockUpdateBankAccountDto,
        ),
      ).rejects.toThrowError(NotFoundException);

      // Ensure validateBankAccountOwnershipSpy was called
      expect(
        mockValidateBankAccountOwnershipService.validate,
      ).toHaveBeenCalled();

      // Ensure that mockBankAccountsRepository.update was not called
      expect(mockBankAccountsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a bank account and validate ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';

      // Mock the ownership validation calls
      mockValidateBankAccountOwnershipService.validate.mockResolvedValueOnce(
        {},
      );

      // Configure the mockBankAccountsRepository.delete method
      mockBankAccountsRepository.delete.mockResolvedValue({});

      await bankAccountsService.remove(mockUserId, mockBankAccountId);

      // Assert that validateBankAccountOwnership and mockBankAccountsRepository.delete were called with the correct parameters
      expect(
        mockValidateBankAccountOwnershipService.validate,
      ).toHaveBeenCalledWith(mockUserId, mockBankAccountId);
      expect(mockBankAccountsRepository.delete).toHaveBeenCalledWith({
        where: { id: mockBankAccountId },
      });
    });

    it('should throw an error if ownership validation fails during remove', async () => {
      const mockUserId = 'mocked-user-id';
      const mockBankAccountId = 'mocked-bank-account-id';

      // Mock the ownership validation calls to throw an error
      mockValidateBankAccountOwnershipService.validate.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        bankAccountsService.remove(mockUserId, mockBankAccountId),
      ).rejects.toThrowError(NotFoundException);

      // Ensure validateBankAccountOwnershipSpy was called
      expect(
        mockValidateBankAccountOwnershipService.validate,
      ).toHaveBeenCalled();

      // Ensure that mockBankAccountsRepository.delete was not called
      expect(mockBankAccountsRepository.delete).not.toHaveBeenCalled();
    });
  });
});
