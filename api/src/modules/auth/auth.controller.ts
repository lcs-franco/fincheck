import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@IsPublic()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiCreatedResponse({
    description: 'Usuário criado e logado',
    type: String,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Usuário logado',
    content: { accessToken: new Object() },
  })
  @ApiConflictResponse({ description: 'This e-mail is already in use!' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
