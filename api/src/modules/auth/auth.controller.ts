import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@IsPublic()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  //Documentation functions
  @ApiOperation({ description: 'Log in route' })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: 'JSON Web Token',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials.',
        error: 'Unauthorized',
      },
    },
    description: 'Unauthorized Exception.',
  })
  //Route function
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  //Documentation functions
  @ApiOperation({ description: 'Register route' })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: 'JSON Web Token',
      },
    },
  })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message: 'This e-mail is already in use!',
        error: 'Conflict',
      },
    },
    description: 'Conflict Exception',
  })
  //Route function
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
