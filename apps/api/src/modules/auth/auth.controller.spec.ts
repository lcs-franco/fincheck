import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let authController: AuthController;

  // Mock of the authentication service
  const mockAuthService = {
    signin: jest.fn(),
    signup: jest.fn(),
  };

  // Test module setup
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  // Before each test, reset all mocks
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should be able to signin', async () => {
    const signinDto: SigninDto = {
      email: 'mail@example.com',
      password: 'examplePassword',
    };

    await authController.signin(signinDto);

    // Check if the corresponding method in the authentication service was called
    expect(mockAuthService.signin).toHaveBeenCalled();
    expect(mockAuthService.signin).toHaveBeenCalledWith(signinDto);
  });

  it('should be able to signup', async () => {
    const signupDto: SignupDto = {
      name: 'John Dore',
      email: 'mail@example.com',
      password: 'examplePassword',
    };

    await authController.signup(signupDto);

    // Check if the corresponding method in the authentication service was called
    expect(mockAuthService.signup).toHaveBeenCalled();
    expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
  });
});
