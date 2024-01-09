import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './services/categories.service';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  const mockCategoriesService = {
    findAllByUserId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return categories for a valid user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];

      // Configura o comportamento do mock para retornar categorias
      mockCategoriesService.findAllByUserId.mockResolvedValue(mockCategories);

      const result = await categoriesController.findAll(mockUserId);

      expect(result).toEqual(mockCategories);
      expect(mockCategoriesService.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });
});
