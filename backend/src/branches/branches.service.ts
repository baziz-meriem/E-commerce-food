import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  findAllPublic() {
    return this.prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const b = await this.prisma.branch.findUnique({ where: { id } });
    if (!b) throw new NotFoundException();
    return b;
  }

  findAllAdmin() {
    return this.prisma.branch.findMany({ orderBy: { name: 'asc' } });
  }

  async create(data: { name: string; address: string; phone?: string }) {
    return this.prisma.branch.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; address?: string; phone?: string; isActive?: boolean },
  ) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data });
  }

  assertBranchAccess(user: AuthUser, branchId: string) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return;
    if (user.role === 'BRANCH_MANAGER' && user.branchId === branchId) return;
    throw new ForbiddenException();
  }
}
