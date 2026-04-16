import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async summary(
    @CurrentUser() user: AuthUser,
    @Query('branchId') branchId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);
    const toDate = to ? new Date(to) : new Date();

    const orderFilter: Prisma.OrderWhereInput = {
      createdAt: { gte: fromDate, lte: toDate },
    };
    if (user.role === Role.BRANCH_MANAGER) {
      if (!user.branchId) {
        return {
          range: { from: fromDate, to: toDate },
          orderCount: 0,
          revenue: 0,
          byStatus: [],
          topProducts: [],
        };
      }
      orderFilter.branchId = user.branchId;
    } else if (branchId) {
      orderFilter.branchId = branchId;
    }

    const orders = await this.prisma.order.findMany({
      where: orderFilter,
      select: { total: true, status: true },
    });

    let revenue = 0;
    for (const o of orders) {
      revenue += Number(o.total);
    }

    const statusMap = new Map<string, number>();
    for (const o of orders) {
      statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
    }
    const byStatus = [...statusMap.entries()].map(([status, count]) => ({
      status,
      count,
    }));

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId', 'nameSnapshot'],
      where: { order: orderFilter },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    return {
      range: { from: fromDate, to: toDate },
      orderCount: orders.length,
      revenue,
      byStatus,
      topProducts: topProducts.map((r) => ({
        name: r.nameSnapshot,
        productId: r.productId,
        quantity: r._sum.quantity ?? 0,
      })),
    };
  }
}
