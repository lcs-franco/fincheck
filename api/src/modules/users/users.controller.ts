import { Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth('accessToken')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  //Documentation functions
  @ApiOperation({ description: 'Route to get the user from the accessToken' })
  @ApiOkResponse({
    schema: {
      example: {
        name: 'John',
        email: 'mail@mail.com',
      },
    },
    description: 'Returned the user',
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
    description: 'UnauthorizedException.',
  })
  //Route function
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }
}
