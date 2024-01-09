import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {
    getUserById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('me', () => {
    it('should return the user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockUser = { name: 'John', email: 'mail@mail.com' };

      // Mocking the ActiveUserId decorator
      jest.spyOn(Reflect, 'getMetadata').mockReturnValueOnce(mockUserId);

      // Mocking the service method
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await usersController.me(mockUserId);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      // Mocking the ActiveUserId decorator
      jest.spyOn(Reflect, 'getMetadata').mockReturnValueOnce(undefined);

      // Mocking to return an error within the getUserById method
      mockUsersService.getUserById.mockRejectedValueOnce(
        new UnauthorizedException(),
      );

      await expect(usersController.me(undefined)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(mockUsersService.getUserById).toHaveBeenCalled();
    });
  });
});
