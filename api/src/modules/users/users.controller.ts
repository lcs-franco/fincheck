import { Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('accessToken')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ description: 'Route to get the user from the accessToken' })
  @ApiOkResponse({
    schema: {
      example: {
        name: 'John',
        email: 'mail@mail.com',
      },
    },
  })
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }
}
