import { Test, TestingModule } from '@nestjs/testing';
import { ValidateCategoryOwnershipService } from './validate-category-ownership.service';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';
import { NotFoundException } from '@nestjs/common';

describe('ValidateCategoryOwnershipService', () => {
  let validateCategoryOwnershipService: ValidateCategoryOwnershipService;
  // Mock category repository for testing
  const mockCategoriesRepository = {
    findFirst: jest.fn(),
  };

  // Set up the testing module
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateCategoryOwnershipService,
        { provide: CategoriesRepository, useValue: mockCategoriesRepository },
      ],
    }).compile();

    validateCategoryOwnershipService =
      module.get<ValidateCategoryOwnershipService>(
        ValidateCategoryOwnershipService,
      );
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(validateCategoryOwnershipService).toBeDefined();
  });

  describe('validate category ownership', () => {
    it('should not throw NotFoundException for valid ownership', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCategoryId = 'mocked-category-id';

      // Mock CategoriesRepository to resolve with a truthy value (valid ownership)
      mockCategoriesRepository.findFirst.mockResolvedValue({});

      await expect(
        validateCategoryOwnershipService.validate(mockUserId, mockCategoryId),
      ).resolves.not.toThrow();

      expect(mockCategoriesRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
    });

    it('should throw NotFoundException for invalid ownership', async () => {
      // Mock data
      const mockUserId = 'mocked-user-id';
      const mockCategoryId = 'mocked-category-id';

      // Configure the mock CategoriesRepository to resolve with a falsy value (invalid ownership)
      mockCategoriesRepository.findFirst.mockResolvedValue(null);

      await expect(
        validateCategoryOwnershipService.validate(mockUserId, mockCategoryId),
      ).rejects.toThrowError(NotFoundException);

      expect(mockCategoriesRepository.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
    });
  });
});
