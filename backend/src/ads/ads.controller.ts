import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ads')
export class AdsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  listPublic(@Query('branchId') branchId?: string) {
    const now = new Date();
    const branchFilter: Prisma.AdWhereInput = branchId
      ? { OR: [{ branchId: null }, { branchId }] }
      : { branchId: null };
    return this.prisma.ad.findMany({
      where: {
        isActive: true,
        AND: [
          branchFilter,
          { OR: [{ startAt: null }, { startAt: { lte: now } }] },
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/all')
  listAll() {
    return this.prisma.ad.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Post('admin')
  create(
    @Body()
    body: {
      titleAr: string;
      imageUrl?: string;
      linkUrl?: string;
      branchId?: string | null;
      sortOrder?: number;
      isActive?: boolean;
      startAt?: string | null;
      endAt?: string | null;
    },
  ) {
    return this.prisma.ad.create({
      data: {
        titleAr: body.titleAr,
        imageUrl: body.imageUrl ?? '',
        linkUrl: body.linkUrl ?? '',
        branchId: body.branchId ?? null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      titleAr: string;
      imageUrl: string;
      linkUrl: string;
      branchId: string | null;
      sortOrder: number;
      isActive: boolean;
      startAt: string | null;
      endAt: string | null;
    }>,
  ) {
    return this.prisma.ad.update({
      where: { id },
      data: {
        ...body,
        startAt:
          body.startAt === undefined
            ? undefined
            : body.startAt
              ? new Date(body.startAt)
              : null,
        endAt:
          body.endAt === undefined
            ? undefined
            : body.endAt
              ? new Date(body.endAt)
              : null,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.prisma.ad.delete({ where: { id } });
  }
}
