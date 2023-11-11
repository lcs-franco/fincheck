import { Controller, Get } from '@nestjs/common';

import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CategoriesService } from './services/categories.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CategorySwaggerDto } from './dto/category-swagger.dto';

@ApiBearerAuth('accessToken')
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  //Documentation functions
  @ApiOperation({ description: 'List all categories by userId' })
  @ApiOkResponse({ type: CategorySwaggerDto })
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
  findAll(@ActiveUserId() userId: string) {
    return this.categoriesService.findAllByUserId(userId);
  }
}
