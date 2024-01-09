import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { hash } from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersRepository = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw an error when email already exists', async () => {
      const signupDto: SignupDto = {
        name: 'John Dore',
        email: 'mail@example.com',
        password: 'examplePassword',
      };

      // Mocking the user on the .findUnique method
      mockUsersRepository.findUnique.mockReturnValueOnce(signupDto);

      try {
        await authService.signup(signupDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('This e-mail is already in use!');
      }

      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signupDto.email },
        select: { id: true },
      });

      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it('should be able to signup a new user and return a token', async () => {
      const signupDto: SignupDto = {
        name: 'John Dore',
        email: 'mail@example.com',
        password: 'examplePassword',
      };

      // Mock to ensure the user object returned by create has an 'id' property
      mockUsersRepository.create.mockResolvedValue({
        id: '020aaa39-522e-4ff1-91fc-8f77e0f2dd0f',
      });
      // Mock to ensure signAsync returned an accessToken
      mockJwtService.signAsync.mockResolvedValue('mockedAccessToken');

      const token = await authService.signup(signupDto);

      expect(token).toEqual({
        accessToken: expect.any(String),
      });

      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signupDto.email },
        select: { id: true },
      });

      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          password: expect.any(String), //Hashed password
          categories: expect.any(Object), //Array of categories created when registering account
        },
      });
    });
  });

  describe('signin', () => {
    it('should throw an error when email is not found', async () => {
      const signinDto: SigninDto = {
        email: 'mail@example.com',
        password: 'examplePassword',
      };

      try {
        await authService.signin(signinDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials.');
      }

      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signinDto.email },
      });
    });

    it('should throw an error when password is invalid', async () => {
      const signinDto: SigninDto = {
        email: 'mail@example.com',
        password: 'examplePassword',
      };

      const wrongPassword = 'falsePassword';

      mockUsersRepository.findUnique.mockReturnValueOnce({
        email: 'mail@example.com',
        password: wrongPassword,
      });

      try {
        await authService.signin(signinDto);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials.');
      }

      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signinDto.email },
      });
    });

    it('should be able to signin a user and return a token', async () => {
      const signinDto: SigninDto = {
        email: 'mail@example.com',
        password: 'examplePassword',
      };

      // Hash password to compare on authService.signin
      const hashedPassword = await hash(signinDto.password, 12);

      // Mock the user
      mockUsersRepository.findUnique.mockResolvedValue({
        ...signinDto,
        id: '020aaa39-522e-4ff1-91fc-8f77e0f2dd0f',
        password: hashedPassword,
      });
      // Mock to ensure signAsync returned an accessToken
      mockJwtService.signAsync.mockResolvedValue('mockedAccessToken');

      const token = await authService.signin(signinDto);
      expect(token).toEqual({
        accessToken: expect.any(String),
      });

      expect(mockUsersRepository.findUnique).toHaveBeenCalled();
      expect(mockUsersRepository.findUnique).toHaveBeenCalledWith({
        where: { email: signinDto.email },
      });
    });
  });
});
