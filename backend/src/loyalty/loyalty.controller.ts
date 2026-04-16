import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyType } from '@prisma/client';

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private loyalty: LoyaltyService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const balance = await this.loyalty.getBalance(user.id);
    const settings = await this.loyalty.getSettings();
    return { balance, settings };
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  history(@CurrentUser() user: AuthUser) {
    return this.prisma.loyaltyTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('admin/adjust')
  async adjust(
    @Body()
    body: { userId: string; pointsDelta: number; description?: string },
  ) {
    const balance = await this.loyalty.getBalance(body.userId);
    const next = balance + body.pointsDelta;
    if (next < 0) throw new BadRequestException('الرصيد لا يكفي');
    return this.prisma.loyaltyTransaction.create({
      data: {
        userId: body.userId,
        type: LoyaltyType.CASHBACK_ADJUST,
        points: Math.abs(body.pointsDelta),
        balanceAfter: next,
        description: body.description ?? 'تعديل إداري',
      },
    });
  }
}
