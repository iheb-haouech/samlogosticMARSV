import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './article.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('article')
@ApiTags('article')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  create() {
    return this.articleService.findAll();
  }
}
