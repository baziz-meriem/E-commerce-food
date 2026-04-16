import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('branches')
export class BranchesController {
  constructor(private branches: BranchesService) {}

  @Get()
  listPublic() {
    return this.branches.findAllPublic();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BRANCH_MANAGER)
  @Get('admin/all')
  listAdmin() {
    return this.branches.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('admin')
  create(
    @Body()
    body: { name: string; address: string; phone?: string },
  ) {
    return this.branches.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body()
    body: { name?: string; address?: string; phone?: string; isActive?: boolean },
  ) {
    return this.branches.update(id, body);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.branches.findOne(id);
  }
}
