import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signin: jest.fn(),
    signup: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

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

    expect(mockAuthService.signup).toHaveBeenCalled();
    expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
  });
});
