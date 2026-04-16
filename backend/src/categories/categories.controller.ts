import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.category.findMany({ orderBy: { nameAr: 'asc' } });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.prisma.category.findUniqueOrThrow({ where: { id } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('admin')
  create(@Body() body: { nameAr: string; slug: string }) {
    return this.prisma.category.create({ data: body });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() body: { nameAr?: string; slug?: string },
  ) {
    return this.prisma.category.update({ where: { id }, data: body });
  }
}
