import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

describe('UsersService', () => {
  let usersService: UsersService;
  const mockUsersRepository = {
    findUnique: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user by userId', async () => {
      const mockUserId = 'mocked-user-id';
      const mockUser = { name: 'John', email: 'mail@mail.com' };

      // Mocking the findUnique method
      mockUsersRepository.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: {
          name: true,
          email: true,
        },
      });
    });

    it('should return null for non-existent user', async () => {
      const mockUserId = 'non-existent-user-id';

      // Mocking the findUnique method to return null, simulating user not found
      mockUsersRepository.findUnique.mockResolvedValue(null);

      const result = await usersService.getUserById(mockUserId);

      expect(result).toBeNull();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: {
          name: true,
          email: true,
        },
      });
    });
  });
});
