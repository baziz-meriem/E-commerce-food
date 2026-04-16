import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(
    @CurrentUser() user: AuthUser,
    @Body()
    body: {
      deliveryAddress: string;
      deliveryPhone: string;
      notes?: string;
      redeemPoints?: number;
    },
  ) {
    return this.orders.checkout(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  myOrders(@CurrentUser() user: AuthUser) {
    return this.orders.listForUser(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/list')
  listAdmin(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
  ) {
    return this.orders.listAdmin(user, branchId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DRIVER)
  @Get('driver/list')
  driverList(@CurrentUser() user: AuthUser) {
    return this.orders.listForDriver(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.getOne(user, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.BRANCH_MANAGER,
    Role.DRIVER,
  )
  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.orders.updateStatus(user, id, body.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Patch(':id/assign-driver')
  assignDriver(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: { driverId: string },
  ) {
    return this.orders.assignDriver(user, id, body.driverId);
  }
}
