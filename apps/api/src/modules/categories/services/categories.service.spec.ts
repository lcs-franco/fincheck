import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  // Mock category repository for testing
  const mockCategoriesRepository = {
    findMany: jest.fn(),
  };

  // Set up the testing module
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: mockCategoriesRepository },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('findAllByUserId', () => {
    it('should return categories for a valid user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];

      // Configure the mock CategoriesRepository to resolve with mockCategories
      mockCategoriesRepository.findMany.mockResolvedValue(mockCategories);

      const result = await categoriesService.findAllByUserId(mockUserId);

      expect(result).toEqual(mockCategories);

      // Assert that the mockCategoriesRepository.findMany was called with the correct parameters
      expect(mockCategoriesRepository.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });
});
