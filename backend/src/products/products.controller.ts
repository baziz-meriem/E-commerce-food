import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  listPublic(
    @Query('branchId') branchId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
  ) {
    return this.products.listPublic({ branchId, categoryId, search: q });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/all')
  listAdmin(
    @Query('branchId') branchId: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    return this.products.listAdmin(user, branchId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Post('admin')
  create(@CurrentUser() user: AuthUser, @Body() body: Record<string, unknown>) {
    return this.products.create(user, body as never);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Patch('admin/:id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.products.update(user, id, body as never);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Delete('admin/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.products.update(user, id, { isActive: false });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.products.getOne(id);
  }
}
