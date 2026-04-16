import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/list')
  listStaff() {
    return this.prisma.user.findMany({
      where: {
        role: {
          in: [
            Role.ADMIN,
            Role.SUPER_ADMIN,
            Role.BRANCH_MANAGER,
            Role.DRIVER,
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branchId: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/drivers')
  listDrivers() {
    return this.prisma.user.findMany({
      where: { role: Role.DRIVER, isActive: true },
      select: { id: true, name: true, phone: true, email: true },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('admin/staff')
  async createStaff(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role: Role;
      branchId?: string;
    },
  ) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        phone: body.phone,
        role: body.role,
        branchId: body.branchId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        branchId: true,
      },
    });
    if (body.role === Role.DRIVER) {
      await this.prisma.driverProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, branchId: body.branchId ?? null },
        update: { branchId: body.branchId ?? null },
      });
    }
    return user;
  }
}
